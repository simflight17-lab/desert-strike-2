const {execSync}=require('child_process'),fs=require('fs'),https=require('https');
const run=(c,cwd)=>execSync(c,{stdio:'inherit',shell:true,cwd});
function get(u,f){return new Promise((res,rej)=>https.get(u,r=>{
 if(r.statusCode>=300&&r.statusCode<400)return get(r.headers.location,f).then(res,rej);
 if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));
 r.pipe(fs.createWriteStream(f)).on('finish',res)}).on('error',rej))}
(async()=>{
 await get('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','www/three.min.js');
 run('npm install');
 if(!fs.existsSync('android'))run('npx cap add android');
 const m='android/app/src/main/AndroidManifest.xml';let x=fs.readFileSync(m,'utf8');
 if(!x.includes('screenOrientation'))x=x.replace(/<activity(\s)/,'<activity android:screenOrientation="sensorLandscape"$1');
 fs.writeFileSync(m,x);
 run('npx cap sync android');
 run(process.platform==='win32'?'gradlew.bat assembleDebug':'./gradlew assembleDebug','android');
 console.log('\nDONE -> android/app/build/outputs/apk/debug/app-debug.apk');
})().catch(e=>{console.error(e.message);process.exit(1)});
