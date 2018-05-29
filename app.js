const fs = require('fs')
const path = require('path')
const util = require('util')
const superagent = require('superagent')
const childProcess = require('child_process');
const url = 'https://packagecontrol.io/channel_v3.json'
const file = path.resolve(__dirname, './dist/channel_v3.json');
const gitCommand = `git add -A && git commit -m "update" && git push`;


function connect(url, file) {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to ${url}...`);
    superagent.get(url)
      .then(res => {
        console.log(`Connected Successfully`);
        const category = JSON.parse(res.text);

        console.log(`Writing data to ${file}`);
        fs.writeFileSync(file, JSON.stringify(category, null, 2));
        console.log(`Writed Successfully`);

        return resolve(category);
      })
      .catch(err => {
        return reject(err);
      })
  });
}
function execGit() {
  return new Promise((resolve, reject) => {
    console.log('Uploading to git...')
    const stdout = childProcess.execSync(gitCommand, { encoding: 'utf8' });
    console.log('Upload Successfully')
    return resolve(stdout);
  }).catch(err => {
    return Promise.reject(err);
  });

}

connect(url, file)
.then(execGit)
.then(res => {
  console.log('Finish');
})
.catch(err => {
  if(!err.stderr) console.log(err)
})
