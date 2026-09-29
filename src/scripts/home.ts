import { createUploadTicket } from '../lib/upload-vault';

const PUBLIC_RPG_MAKER_EXTENSIONS = new Set(['.rmmzsave']);

function extensionOf(fileName: string): string {
    const index = fileName.lastIndexOf('.');
    return index === -1 ? '' : fileName.slice(index).toLowerCase();
}

function editorPath(locale?: string | null): string {
    const lang = locale && locale !== 'en' ? `/${locale}` : '';
    return `${lang}/editor/rpg-maker-mz/`;
}

function appendUploadToken(path: string, token: string): string {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('fileToken', token);
    return `${url.pathname}${url.search}`;
}

const initFileUpload = () => {
    const fileInput = document.getElementById('smart-file-input') as HTMLInputElement | null;
    const uploadZone = document.getElementById('smart-upload-zone') as HTMLDivElement | null;

    if (!fileInput || !uploadZone) return;

    const currentLang = (window as any).currentLang || 'en';

    const setBusyState = (busy: boolean) => {
        uploadZone.classList.toggle('pointer-events-none', busy);
        uploadZone.classList.toggle('opacity-75', busy);
    };

    const handleFile = async (file: File) => {
        if (!PUBLIC_RPG_MAKER_EXTENSIONS.has(extensionOf(file.name))) {
            alert('This public editor currently accepts tested RPG Maker MZ .rmmzsave files only.');
            return;
        }

        try {
            setBusyState(true);
            const ticket = await createUploadTicket(file, {
                locale: currentLang,
                source: 'home-rpg-maker',
            });
            window.location.assign(appendUploadToken(editorPath(ticket.locale), ticket.token));
        } catch (error) {
            console.error(error);
            alert('We could not open this file in your browser. Please try again from the RPG Maker editor page.');
        } finally {
            setBusyState(false);
        }
    };

    fileInput.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files?.[0]) {
            await handleFile(target.files[0]);
        }
    });

    uploadZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadZone.classList.add('border-primary-300', 'bg-white/10');
    });

    uploadZone.addEventListener('dragleave', (event) => {
        event.preventDefault();
        uploadZone.classList.remove('border-primary-300', 'bg-white/10');
    });

    uploadZone.addEventListener('drop', async (event) => {
        event.preventDefault();
        uploadZone.classList.remove('border-primary-300', 'bg-white/10');
        const files = (event as DragEvent).dataTransfer?.files;
        if (files?.[0]) {
            await handleFile(files[0]);
        }
    });
};

initFileUpload();
