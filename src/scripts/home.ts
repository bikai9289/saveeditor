import { beginEditorFlow, isRpgMakerSaveFile } from '../lib/ingest';

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
        if (!isRpgMakerSaveFile(file.name)) {
            alert('Choose an RPG Maker MV .rpgsave or MZ .rmmzsave file.');
            return;
        }

        try {
            setBusyState(true);
            const { url } = await beginEditorFlow(file, {
                locale: currentLang,
                source: 'home-rpg-maker',
            });
            window.location.assign(url);
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
