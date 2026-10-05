import assert from 'node:assert/strict';
import { parseSaveFile } from '../src/lib/parseSaveFile';
import { buildRejectedSupportPack, supportPackMailto } from '../src/lib/supportPack';
import LZString from 'lz-string';
import { buildEditorUrl, isRpgMakerSaveFile } from '../src/lib/ingest';

const legacyFile = new File(['legacy save bytes'], 'renamed.rpgsave');
const legacyResult = await parseSaveFile(legacyFile, 'rpg-maker-mz');
assert.equal(legacyResult.outcome.reasonCode, 'unsupported_extension');
assert.equal(legacyResult.outcome.capabilities.canView, false);

for (const [slug, allowed] of [['rpg-maker-mv', 'rpgsave'], ['rpg-maker-mz', 'rmmzsave']]) {
    for (const ext of ['rpgsave', 'rmmzsave', 'rxdata', 'rvdata', 'rvdata2', 'lsd', 'zip', 'exe', 'json', '']) {
        if (ext === allowed) continue;
        const result = await parseSaveFile(new File(['legacy bytes'], `file.${ext}`), slug);
        assert.equal(result.outcome.reasonCode, 'unsupported_extension', `${slug} must reject .${ext}`);
        assert.equal(result.outcome.capabilities.canView, false);
        assert.equal(result.outcome.capabilities.canEdit, false);
        assert.equal(result.outcome.capabilities.canSave, false);
    }
    for (const bytes of ['', 'corrupt save']) {
        const result = await parseSaveFile(new File([bytes], `file.${allowed}`), slug);
        assert.equal(result.outcome.reasonCode, 'parse_failed');
        assert.equal(result.outcome.capabilities.canSave, false);
    }
}
const mvFile = new File([LZString.compressToBase64(JSON.stringify({ party: { _gold: 1234 } }))], 'FILE1.RPGSAVE');
const mvResult = await parseSaveFile(mvFile, 'rpg-maker-mv');
assert.equal(mvResult.outcome.capabilities.canSave, true);
assert.equal(mvResult.outcome.data.party._gold, 1234);
assert.equal(buildEditorUrl('local-token', 'en', mvFile.name), '/editor/rpg-maker-mv/?fileToken=local-token');
assert.equal(buildEditorUrl('local-token', 'en', 'file1.rmmzsave'), '/editor/rpg-maker-mz/?fileToken=local-token');
assert.equal(isRpgMakerSaveFile('FILE1.RPGSAVE'), true);
assert.equal(isRpgMakerSaveFile('file.rxdata'), false);
assert.throws(() => buildEditorUrl('token', 'en', 'file.rxdata'));

const sensitiveValue = 'PRIVATE_SAVE_CONTENT_SHOULD_NOT_BE_IN_EMAIL';
const supportPack = buildRejectedSupportPack({
    file: new File(['bytes'], 'broken.rmmzsave'),
    parserPath: 'rpgmaker',
    failureStage: 'parse_failed',
    reasonCode: 'parse_failed',
    data: { secret: sensitiveValue },
    headerBytes: new Uint8Array([1, 2, 3]),
});
const mailto = supportPackMailto(supportPack);
assert.equal(mailto.includes(sensitiveValue), false);

console.log('Editor safety checks passed.');
