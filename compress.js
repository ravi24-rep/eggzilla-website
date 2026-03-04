import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
    const menuDir = './src/assets/menu';
    const typesPath = './src/types.ts';
    let typesContent = fs.readFileSync(typesPath, 'utf8');

    const files = fs.readdirSync(menuDir);

    for (const file of files) {
        if (file.match(/\.(png|jpe?g)$/i)) {
            console.log('Compressing', file);
            const filePath = path.join(menuDir, file);
            const newPath = path.join(menuDir, file.replace(/\.(png|jpe?g)$/i, '.webp'));

            const buffer = fs.readFileSync(filePath);
            await sharp(buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(newPath);

            // delete old huge image
            fs.unlinkSync(filePath);

            // update types.ts reference
            typesContent = typesContent.replace(file, path.basename(newPath));
        }
    }

    // Also compress the logo if exists
    const logoPathDef = './src/assets/eggzilla-logo.png';
    if (fs.existsSync(logoPathDef)) {
        console.log('Compressing logo...');
        const buf = fs.readFileSync(logoPathDef);
        await sharp(buf)
            .resize({ width: 400, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile('./src/assets/eggzilla-logo.webp');
        fs.unlinkSync(logoPathDef);
    }

    fs.writeFileSync(typesPath, typesContent);
    console.log('Finished compressing all images to WEBP!');
}

optimizeImages().catch(console.error);
