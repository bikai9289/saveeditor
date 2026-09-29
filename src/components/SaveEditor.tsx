import React, { useState } from 'react';
import { parseSaveFileSafe } from '../lib/parseSaveFile';
import { buildRejectedSupportPackFromFile, supportPackMailto } from '../lib/supportPack';
import { getLocalRetentionEnabled, saveLocalHistoryRecord, setLocalRetentionEnabled } from '../lib/local-retention';
import RpgMakerEditor from './editors/RpgMakerEditor';
import JsonEditor from './JsonEditor';
import type { ParserCapability, SupportPackSummary } from '../lib/parsers/types';

interface SaveEditorProps {
    file: File;
    onBack: () => void;
    editorSlug?: string;
    uploadToken?: string;
}

export default function SaveEditor({ file, onBack, editorSlug }: SaveEditorProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorAdvice, setErrorAdvice] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);
    const [format, setFormat] = useState('unknown');
    const [capabilities, setCapabilities] = useState<ParserCapability | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [supportPack, setSupportPack] = useState<SupportPackSummary | null>(null);
    const [downloadNotice, setDownloadNotice] = useState<'bookmark' | 'historyPrompt' | null>(null);
    const [pendingHistoryBlob, setPendingHistoryBlob] = useState<Blob | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        const parseFile = async () => {
            try {
                setLoading(true);
                setError(null);
                setErrorAdvice([]);
                setSupportPack(null);
                setWarnings([]);

                const maxFileSize = 50 * 1024 * 1024;
                if (file.size > maxFileSize) {
                    const rejectedPack = await buildRejectedSupportPackFromFile({
                        file,
                        parserPath: 'rpgmaker',
                        failureStage: 'file_size_limit',
                        reasonCode: 'file_too_large',
                        format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
                    });
                    if (cancelled) return;
                    setSupportPack(rejectedPack);
                    setError('File too large. Maximum file size is 50MB.');
                    setErrorAdvice(['Use the original RPG Maker save file directly from the game save folder.', 'If the file is inside an archive, extract it first and upload the save file itself.']);
                    setLoading(false);
                    return;
                }

                const { outcome, uiFormat } = await parseSaveFileSafe(file, editorSlug);
                if (cancelled) return;

                setFormat(uiFormat);
                setCapabilities(outcome.capabilities);
                setWarnings(outcome.warnings || []);
                setSupportPack(outcome.diagnostics?.supportPack || null);

                if (!outcome.capabilities.canView) {
                    setData(null);
                    setError(outcome.reason || 'This public editor currently supports RPG Maker save files only.');
                    setErrorAdvice([
                        'Supported formats: .rpgsave, .rmmzsave, .rvdata2, .rvdata, .rxdata, and .lsd.',
                        'Use a backup copy first. The editor runs locally in your browser and does not upload save contents to a server.',
                    ]);
                    setLoading(false);
                    return;
                }

                setData(outcome.data);
                setLoading(false);
            } catch (err: any) {
                if (cancelled) return;
                const rejectedPack = await buildRejectedSupportPackFromFile({
                    file,
                    parserPath: 'rpgmaker',
                    failureStage: 'exception',
                    reasonCode: 'parse_failed',
                    format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
                });
                if (cancelled) return;
                setSupportPack(rejectedPack);
                setError(err?.message || 'Failed to parse this RPG Maker save file.');
                setErrorAdvice([
                    'Confirm this is an RPG Maker save file and not a renamed archive or shortcut.',
                    'Try a fresh backup from the game save folder before editing again.',
                ]);
                setLoading(false);
            }
        };

        void parseFile();

        return () => {
            cancelled = true;
        };
    }, [file, editorSlug]);

    const handleDownload = async () => {
        if (!data || !capabilities?.canSave) return;

        try {
            const { buildRPGMakerMV } = await import('../lib/parsers/rpgmaker');
            const editedBlob = await buildRPGMakerMV(file, data);
            downloadBlob(await buildDownloadPackage(file, editedBlob), `${file.name}.edited-with-backup.zip`);

            setPendingHistoryBlob(editedBlob);
            const historyEnabled = await getLocalRetentionEnabled();
            if (!historyEnabled) {
                setDownloadNotice('historyPrompt');
                return;
            }

            await saveLocalHistoryRecord({
                fileName: file.name,
                format,
                editorSlug,
                originalFile: file,
                editedBlob,
            });
            setPendingHistoryBlob(null);
            setDownloadNotice('bookmark');
        } catch (err: any) {
            alert(`Failed to build the edited RPG Maker save: ${err?.message || String(err)}`);
        }
    };

    const enableLocalHistory = async () => {
        await setLocalRetentionEnabled(true);
        if (pendingHistoryBlob) {
            await saveLocalHistoryRecord({
                fileName: file.name,
                format,
                editorSlug,
                originalFile: file,
                editedBlob: pendingHistoryBlob,
            });
            setPendingHistoryBlob(null);
        }
        setDownloadNotice('bookmark');
    };

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
                <p className="text-gray-600">Reading RPG Maker save locally...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="mb-3 text-2xl font-bold text-red-800">This file is not editable here</h2>
                <p className="mb-5 text-red-700">{error}</p>
                {errorAdvice.length > 0 && (
                    <ul className="mb-6 space-y-2 text-left text-sm text-red-700">
                        {errorAdvice.map((item) => (
                            <li key={item} className="rounded-lg bg-white/70 px-4 py-2">
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={onBack}
                        className="rounded-lg border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                        Choose another file
                    </button>
                    {supportPack && (
                        <a
                            href={supportPackMailto(supportPack)}
                            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                        >
                            Send support details
                        </a>
                    )}
                </div>
            </div>
        );
    }

    const canSave = Boolean(capabilities?.canSave);
    const isRpgMakerFormat = format === 'rpgmaker' || format === 'rpgmaker-ruby-marshal' || format === 'rpgmaker-2000-2003-lsd';

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-600">RPG Maker Save Editor</p>
                        <h1 className="text-2xl font-bold text-gray-900">{file.name}</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Parsed locally as {formatLabel(format)}. Download creates a zip containing the edited file and the original backup.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={onBack}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Choose another file
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!canSave}
                            className="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            Download edited save
                        </button>
                    </div>
                </div>

                {warnings.length > 0 && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        {warnings.map((warning) => (
                            <p key={warning}>{warning}</p>
                        ))}
                    </div>
                )}

                {downloadNotice === 'historyPrompt' && (
                    <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p>Your edited file was downloaded. Enable local history to keep a browser-only copy for faster repeat edits.</p>
                            <button
                                onClick={enableLocalHistory}
                                className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
                            >
                                Enable local history
                            </button>
                        </div>
                    </div>
                )}

                {downloadNotice === 'bookmark' && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                        Download complete. Keep the original backup until the edited save loads correctly in game.
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {isRpgMakerFormat ? (
                    <RpgMakerEditor data={data} onChange={setData} readOnly={!capabilities?.canEdit} />
                ) : (
                    <JsonEditor data={data} onChange={setData} readOnly={!capabilities?.canEdit} />
                )}
            </div>
        </div>
    );
}

function formatLabel(format: string): string {
    if (format === 'rpgmaker-ruby-marshal') return 'RPG Maker XP/VX/VX Ace';
    if (format === 'rpgmaker-2000-2003-lsd') return 'RPG Maker 2000/2003';
    if (format === 'rpgmaker') return 'RPG Maker MV/MZ';
    return 'RPG Maker save';
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

async function buildDownloadPackage(originalFile: File, editedBlob: Blob): Promise<Blob> {
    const { zipSync } = await import('fflate');
    const archive = zipSync({
        [originalFile.name]: new Uint8Array(await editedBlob.arrayBuffer()),
        [`backup-original-${originalFile.name}`]: new Uint8Array(await originalFile.arrayBuffer()),
        'README.txt': new TextEncoder().encode('Test the edited RPG Maker save in game before deleting the backup file.'),
    });
    const buffer = new ArrayBuffer(archive.byteLength);
    new Uint8Array(buffer).set(archive);
    return new Blob([buffer], { type: 'application/zip' });
}
