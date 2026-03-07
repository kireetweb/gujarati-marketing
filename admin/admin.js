import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- REPLACE WITH YOUR SUPABASE URL AND ANON KEY ---
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const slotSelect = document.getElementById('slot-select');

// Auth Check
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadSlotData(1); // Load default slot
    }
}
checkAuth();

// Login Logic
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        showToast(error.message, 'error');
    } else {
        showToast('Login Successful', 'success');
        checkAuth();
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
});

// Load Data into Form
slotSelect.addEventListener('change', (e) => loadSlotData(e.target.value));

async function loadSlotData(id) {
    const { data, error } = await supabase.from('advertisements').select('*').eq('id', id).single();
    if (data) {
        document.getElementById('banner_heading').value = data.banner_heading || '';
        document.getElementById('banner_text').value = data.banner_text || '';
        document.getElementById('bio_name').value = data.bio_name || '';
        document.getElementById('card_subtext').value = data.card_subtext || '';
        document.getElementById('social_platform').value = data.social_platform || 'IG';
        document.getElementById('social_link').value = data.social_link || '';
        document.getElementById('product_link').value = data.product_link || '';
    }
}

// Upload File helper
async function uploadFile(file, path) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('media').upload(fileName, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    return urlData.publicUrl;
}

// Form Submission
document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.innerText = "Publishing...";
    
    try {
        const id = document.getElementById('slot-select').value;
        const bannerImageFile = document.getElementById('banner_image').files[0];
        const sponsorLogoFile = document.getElementById('sponsor_logo').files[0];

        let updateData = {
            banner_heading: document.getElementById('banner_heading').value,
            banner_text: document.getElementById('banner_text').value,
            bio_name: document.getElementById('bio_name').value,
            card_subtext: document.getElementById('card_subtext').value,
            social_platform: document.getElementById('social_platform').value,
            social_link: document.getElementById('social_link').value,
            product_link: document.getElementById('product_link').value,
        };

        if (bannerImageFile) updateData.banner_image_url = await uploadFile(bannerImageFile, `banner_${id}`);
        if (sponsorLogoFile) updateData.sponsor_logo_url = await uploadFile(sponsorLogoFile, `logo_${id}`);

        const { error } = await supabase.from('advertisements').update(updateData).eq('id', id);
        
        if (error) throw error;
        showToast('Successfully Published!', 'success');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        saveBtn.innerText = "Publish Updates";
    }
});

// Toast Notifier
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.className = 'toast', 3000);
}
