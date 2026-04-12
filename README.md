# 📈 Gujarati Marketing: Digital Agency Platform

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📖 About
Gujarati Marketing is a high-performance digital agency showcase and lead-generation platform. Deployed on an open-source GitHub Pages environment, it ensures zero-maintenance hosting while securely tunneling all lead captures and contact inquiries to an isolated Supabase CRM backend.

## 🏗️ Ecosystem Architecture
* **Frontend:** Open-source architecture for maximum transparency and rapid iteration.
* **Hosting (GitHub Pages):** Automated CI/CD pipeline deploying directly from the `main` branch.
* **Database (Supabase):** Standalone backend infrastructure optimized for secure CRM lead capture.

---

## ⚙️ Technical Implementation

### 1. Database Schema (Lead Capture)
RLS ensures that competitors or malicious bots cannot query the database to extract your captured lead data. Write-access is public, read-access is strictly admin-only.

```sql
-- Create the Leads Table
CREATE TABLE agency_leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_contact VARCHAR(100) NOT NULL,
    service_interest VARCHAR(50),
    project_budget VARCHAR(50),
    additional_notes TEXT,
    is_contacted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE agency_leads ENABLE ROW LEVEL SECURITY;

-- Allow public frontend to push data to the database
CREATE POLICY "Enable insert for public" ON agency_leads FOR INSERT WITH CHECK (true);

-- Block public reads: Only authenticated admin can view leads
CREATE POLICY "Enable read for authenticated admin" ON agency_leads FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. Core JavaScript Logic (Lead Submission)
Intercepts the DOM form submission, prevents page reload, and pushes data securely via the REST API.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

document.getElementById('marketing-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const leadData = {
        client_name: document.getElementById('name').value,
        client_contact: document.getElementById('contact').value,
        service_interest: document.getElementById('service').value,
        project_budget: document.getElementById('budget').value,
        additional_notes: document.getElementById('message').value
    };

    try {
        const { error } = await supabase.from('agency_leads').insert([leadData]);
        if (error) throw error;
        
        showSuccessBanner('Thank you! Our team will contact you shortly.');
        e.target.reset(); 
    } catch (error) {
        console.error('Lead Capture Error:', error);
        showErrorBanner('An error occurred. Please try again.');
    }
});
```

---

## ⚠️ Infrastructure Protocols

### Automated Deployments
Because this site uses GitHub Pages, any changes merged into the `main` branch will automatically build and deploy to the live website within 1-2 minutes.

### The 7-Day Supabase Sleep Cycle
If the backend receives zero form submissions or admin logins for 7 days, Supabase enters "Sleep Mode." The live website will remain visible, but the Admin Dashboard will throw errors.
* **Wake Protocol:** Go to Supabase.com, click "Log in", select **Continue with GitHub** (Use the `@kireetnews` account), locate the project, and click **Restore Project**.

---
*Architected & Developed by Mayur Sonar.*
