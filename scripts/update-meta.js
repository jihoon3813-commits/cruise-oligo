import fs from 'fs';
import path from 'path';

async function updateMeta() {
  const convexUrl = "https://doting-porcupine-463.convex.site/api/site-config";
  try {
    console.log('Fetching latest configuration from Convex...');
    const res = await fetch(convexUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const config = await res.json();
    const description = config?.metaDescription || "격이 다른 프리미엄 크루즈 멤버십, 올리고크루즈와 함께 세계를 여행하세요.";
    
    const indexPath = path.resolve('index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Regex to replace content attribute
    const updateTag = (html, property, newValue) => {
        const regex = new RegExp(`(<meta (?:name|property)="${property}" content=")(?:[^"]*)(")`, 'g');
        return html.replace(regex, `$1${newValue}$2`);
    }

    html = updateTag(html, 'description', description);
    html = updateTag(html, 'og:description', description);
    html = updateTag(html, 'twitter:description', description);
    
    fs.writeFileSync(indexPath, html);
    console.log('✅ Successfully updated index.html with latest meta description:', description);
  } catch (err) {
    console.error('❌ Failed to update meta tags:', err);
    // Don't fail the build, just proceed with existing index.html
  }
}

updateMeta();
