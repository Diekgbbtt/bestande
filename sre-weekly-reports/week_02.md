### Forked repository

https://gitlab.uzh.ch/diego.gobbetti/ssr-lab-repo-group-2

### Macro Workflow

apt version installed was very old - couldn’t update it

We were prompted multiple times to update the Ubuntu version, we did but apt wasn’t updated even after reboot.

We proceeded to installing binaries manually : node, npm, yarn

installed project dependencies

error incompatible node version with pacakge bson@7.2.0

updated node to version 24

updated accordingly node and npm versions in package.json

installed project dependencies

current patches were warned as invalid due to dependencies update, as they were defined with the “minumum”-like version

looked into what they were patching

code was fine

installed nix for easier package management

installed mongodb - created db, collections and imported data

created new key and self-signed cert

started app

forwarded port 3000 locally to 443 on the VM.

### Errors & Takeaways

*think twice before taking this course next time*

Incompatible patches after dependencies update after nodejs version update to 24. The command used that had this output is: yarn install. 

```jsx
LATEST STATE, ERROR AFTER DOWNLOADING DEPENDENCIES :

- ***ERROR**** Failed to apply patch for package **@types/react** at path

node_modules/@types/react

This error was caused because **@types/react** has changed since you

made the patch file for it. This introduced conflicts with your patch,

just like a merge conflict in Git when separate incompatible changes are

made to the same piece of code.

Maybe this means your patch file is no longer necessary, in which case

hooray! Just delete it!

Otherwise, you need to generate a new patch file.

To generate a new one, just repeat the steps you made to generate the first

one.

i.e. manually make the appropriate file changes, then run

patch-package @types/react

Info:

Patch file: patches/@types+react+17.0.4.patch

Patch was made for version: **17.0.4**

Installed version: **17.0.91**

- ***ERROR**** Failed to apply patch for package **react-native-push-notification** at path

node_modules/react-native-push-notification

This error was caused because **react-native-push-notification** has changed since you

made the patch file for it. This introduced conflicts with your patch,

just like a merge conflict in Git when separate incompatible changes are

made to the same piece of code.

Maybe this means your patch file is no longer necessary, in which case

hooray! Just delete it!

Otherwise, you need to generate a new patch file.

To generate a new one, just repeat the steps you made to generate the first

one.

i.e. manually make the appropriate file changes, then run

patch-package react-native-push-notification

Info:

Patch file: patches/react-native-push-notification+3.1.9.patch

Patch was made for version: **3.1.9**

Installed version: **3.5.2**

- --

patch-package finished with 2 error(s).

Jetifier found 1787 file(s) to forward-jetify. Using 4 workers...

Done in 173.23s.
```

### Commands

```
6  uname -a
7  du -h /
8  ls -la
9  git clone <https://gitlab.uzh.ch/diego.gobbetti/ssr-lab-repo-group-2.git> bestande-web-app
```

10  exit
11  ls .ssh/
12  ls
13  ls ..
14  pwd
15  ls
16  pwd
17  ls 'la
18  '
19  ls -la
20  git clone https://gitlab.uzh.ch/diego.gobbetti/ssr-lab-repo-group-2.git bestande-web-app
21  git config
22  git config --global
23  git config -l
24  git config --get-all
25  git config -get user
26  git config --get user
27  ls -la
28  git config --global --list
29  git config --global --list --show-origin
30  git config --global --edit
31  ls -la
32  pwd
33  ls .gitconfig
34  cat .gitconfig
35  git git remote set-url origin [https://glpat-2-uZZmIb3P4VLPkoBbJOP286MQp1OjZiMgk.01.0z0zv0lt8](https://glpat-2-uzzmib3p4vlpkobbjop286mqp1ojzimgk.01.0z0zv0lt8/)@://gitlab.com
36  git remote set-url origin [https://glpat-2-uZZmIb3P4VLPkoBbJOP286MQp1OjZiMgk.01.0z0zv0lt8](https://glpat-2-uzzmib3p4vlpkobbjop286mqp1ojzimgk.01.0z0zv0lt8/)@://gitlab.com
37  git clone https://gitlab.uzh.ch/diego.gobbetti/ssr-lab-repo-group-2.git bestande-web-app
38  mkdir bestande-web-app
39  cd bestande-web-app/
40  git init
41  git remote set-url origin [https://glpat-2-uZZmIb3P4VLPkoBbJOP286MQp1OjZiMgk.01.0z0zv0lt8](https://glpat-2-uzzmib3p4vlpkobbjop286mqp1ojzimgk.01.0z0zv0lt8/)@://gitlab.com
42  git clone https://gitlab.uzh.ch/diego.gobbetti/ssr-lab-repo-group-2.git
43  pwd
44  ls -la
45  pwd
46  cat .git
47  cat .git/config \
48  ls -la ssr-lab-repo-group-2/
49  cat ssr-lab-repo-group-2/.git/config
50  yarn
51  sudo apt install cmdtest
52  yarn
53  node
54  sudo apt install nodejs
55  node --help
56  node --version
57  sudo apt update
58  apt list --upgradable
59  apt list --upgradable | grep node
60  apt list --upgradable | grep nodejs
61  node --version
62  sudo apt upgrade nodejs
63  node --version
64  sudo apt install nodejs=20.6.1
65  sudo apt list
66  sudo apt list | grep nodejs
67  apt list --all-versions nodejs
68  apt-get install nodejs=20.6.1
69  sudo apt-get install nodejs=20.6.1
70  sudo apt-get list --all-versions nodejs
71  sudo apt-get list nodejs
72  node -v
73  nvm
74  sudo apt-get update
75  sudo apt upgrade --all
76  sudo apt upgrade
77  uname -a
78  apt -v
79  lsb_release -a
80  uname -a
81  curl -L -o https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz
82  curl https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz
83  ls /
84  curl https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz -o /usr/lib/
85  curl https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz -o /usr/lib/node.tar.gz
86  sudo curl https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz -o /usr/lib/node.tar.gz
87  cd /usr/lib/
88  ls
89  gz
90  gunzip
91  gunzip --help
92  gunzip node.tar.gz
93  sudo gunzip node.tar.gz
94  ls node.tar
95  sudo su+
96  sudo su
97  cd \$HOME/
98  cd /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/
99  yarn install
100  yarn --help
101  yarn install .
102  sudo apt dist-upgrade -y
103  lsb_release
104  lsb_release -l
105  lsb_release --help
106  lsb_release -v
107  lsb_release -a
108  yarn --version
109  ls -la
110  npm
111  sudo apt install npm
112  sudo reboot
113  lsb_release -a
114  sudo apt update
115  sudo apt upgrade
116  yarn --version
117  cd bestande-web-app/ssr-lab-repo-group-2/
118  yarn
119  yarn --help
120  npm install
121  yarn --version
122  npm install -g yarn
123  sudo npm install -g yarn
124  yarn --version
125  curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.19
126  yarn --version
127  ls
128  ls -la
129  source curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version [VERSIONE]
130  source  /home/ubuntu/.bashrc/
131  source  /home/ubuntu/.bashrc
132  yarn --version
133  yarn --help
134  yarn install
135  node --version
136  which node
137  which -ln node
138  which -n node
139  ln -r /usr/bin/node
140  ln -s /usr/bin/node
141  node
142  node --version
143  /usr/lib/node/node-v20.6.1-linux-x64/bin/node -v
144  rm /usr/bin/node
145  sudo apt remove node
146  sudo apt remove nodejs
147  node --version
148  ln -s /usr/lib/node/node-v20.6.1-linux-x64/bin/node /usr/bin/node
149  sudo ln -s /usr/lib/node/node-v20.6.1-linux-x64/bin/node /usr/bin/node
150  node --version
151  yarn install
152  history | grep node
153  npm
154  npm node --versino
155  npm node --version
156  curl https://nodejs.org/dist/latest-v20.x/node-v20.20.0-linux-x64.tar.gz -o /usr/lib/
157  sudo curl https://nodejs.org/dist/latest-v20.x/node-v20.20.0-linux-x64.tar.gz -o /usr/lib/node-latest
158  rm /usr/lib/node-latest
159  sudo rm /usr/lib/node-latest
160  sudo curl https://nodejs.org/dist/latest-v20.x/node-v20.20.0-linux-x64.tar.gz -o /usr/lib/node-latest.tar.gz
161  histort | grep gunzip
162  history | grep gunzip
163  cd /usr/lib/ &&  sudo gunzip node.tar.gz
164  cd /usr/lib/ &&  sudo gunzip node-latest.tar.gz
165  history | grep tar
166  history | grep -x
167  history
168  sudo su
169  sudo curl https://nodejs.org/dist/v24.0.0/node-v24.0.0-linux-x64.tar.gz  -o /usr/lib/node-latest.tar.gz
170  gunzip node-latest.tar.gz
171  sudo gunzip node-latest.tar.gz
172  tar -xf node-latest.tar node-v24.0.0-linux-x64/-C ccc
173  mkdir node24 && tar -xf node-latest.tar -C node-24/
174  sudo mkdir node24 && sudo tar -xf node-latest.tar -C node-24/
175  sudo mkdir node24 && sudo tar -xf node-latest.tar -C node24/
176  sudo tar -xf node-latest.tar -C node24/
177  node24/node-v24.0.0-linux-x64/bin/node --version
178  rm /usr/bin/node
179  sudo rm /usr/bin/node
180  ln -s /usr/bin/node
181  ln -s /usr/lib/node24/node-v24.0.0-linux-x64/bin/node  /usr/bin/node
182  sudo ln -s /usr/lib/node24/node-v24.0.0-linux-x64/bin/node  /usr/bin/node
183  source
184  source .
185  secho $home
186  secho $HOME
187  echo $HOME
188  source $HOME/.bashrc
189  cd $HOME/bestande-web-app/ss
190  cd \$HOME/bestande-web-app/ssr-lab-repo-group-2/
191  cd $HOME/bestande-web-app/ssr-lab-repo-group-2/
192  yarn install
193  vim package.json
194  yarn install
195  cd bestande-web-app/ssr-lab-repo-group-2/
196  yarn --version
197  nodejs --version
198  node --version
199  exit
200  ls
201  cd bestande-web-app/
202  ls
203  cd ssr-lab-repo-group-2/
204  ls
205  node --version
206  yarn --version
207  history
208  yarn install
209  history
210  ls
211  ---george---
212  history
213  ls
214  cd patches/
215  ls
216  cd bestande-web-app/
217  dc ssr-lab-repo-group-2/
218  cd ssr-lab-repo-group-2/
219  yarn install
220  cat patch.txt
221  cat patches/react-native-
222  cat patches/react-native-push-notification+3.1.9.patch
223  ls -la patches
224  mv patches/@types+react+17.0.4.patch patches/@types+react+17.0.4-OLD-patch
225  ls -la patches
226  mv patches/react-native-gifted-chat+0.16.3.patch   react-native-gifted-chat+0.16.3-OLD-patch
227  mv patches/react-native-push-notification+3.1.9.patch react-native-push-notification+3.1.9-OLD-patch
228  mv  react-native-gifted-chat+0.16.3-OLD-patch patches/react-native-gifted-chat+0.16.3.patch
229  ls -la patches
230  ls react-native-push-notification+3.1.9-OLD-patch
231  mv react-native-push-notification+3.1.9-OLD-patch patches/react-native-push-notification+3.1.9-OLD-patch
232  ls -la patches
233  yarn install
234  mongodb
235  sudo apt install mongodb
236  cat /etc/lsb-release
237  sh <(curl -L https://nixos.org/nix/install) --daemon
238  nix
239  nix-shell
240  exit
241  nix-shell
242  nix
243  nix --help
244  nix-shell -p mongodb
245  mkdir  ~/.config/nixpkgs
246  mkdir -p ~/.config/nixpkgs
247  vi
248  vi ~/.config/nixpkgs/config.nix
249  nix-shell -p mongodb
250  cd bestande-web-app/
251  cd ssr-lab-repo-group-2/
252  git config
253  git config --global
254  git config --get name
255  git config --get username
256  git config --get-all
257  git config -l
258  cat .gitattributes
259  cat .git/config
260  git fetch --all
261  git config --global credential.helper libsecret
262  git fetch --all
263  git --version
264  git config --global credential.helper store
265  git fetch --al
266  cat ~/.git-credentials
267  whoami
268  nix profile install nixpkgs#mongodb
269  nix-profile install nixpkgs#mongodb
270  nix profile add nixpkgs#mongodb
271  nix profile
272  nix --help
273  nix profile
274  nix profiles
275  nix profile
276  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc |    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg    --dearmor
277  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
278  ls -la /etc/apt/sources.list.d/mongodb-org-7.0.list
279  sudo apt-get update
280  sudo apt-get install -y mongodb-org
281  mongodb -v
282  mongodb
283  mongod
284  mongod --help
285  ls -la modul*
286  ls -la
287  mongosh
288  ls -la
289  mkdir -p db/data/modules
290  pwd
291  mongod --dbpath /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db/data/modules
292  mongod --dbpath /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db/data/modules > /dev/null   &
293  mongosh
294  mongoimport --db bestande --collection modules --file db_backup_data/updated_modules_including_FS24_final.json  --jsonArray
295  pwd
296  ls -la
297  mongoimport --db bestande --collection modules --file ./db_backup_data/updated_modules_including_FS24_final.json  --jsonArray
298  pwd
299  mongoimport --db bestande --collection modules --file /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data/updated_modules_including_FS24_final.json  --jsonArray
300  ls /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data/updated_modules_including_FS24_final.json
301  mongoimport --db bestande --collection modules --file /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data/updated_modules_including_FS25_final.json  --jsonArray
302  cp web/.env.example web/.env
303  vim web/.env
304  ls /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data
305  sudo vim /etc/hosts
306  pwd
307  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
308  export PORT=443
309  echo $PORT
310  npm run dev
311  yarn --he
312  yarn run dev
313  sudo yarn run dev
314  yarn --help
315  yarn --version
316  yarn run dev
317  sudo yarn --version
318  sudo apt install npm
319  npm --version
320  npm run dev
321  sudo npm run dev
322  cd web
323  sudo npm run dev
324  node --version
325  which node
326  nodejs
327  npm --help
328  cd ..
329  ls -la
330  cat scripts/
331  sudo npm run dev
332  vim package.json
333  sudo npm run dev
334  sudo npm run dev > /dev/null &
335  curl
336  curl [https://staging.bestande.ch](https://staging.bestande.ch/)
337  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
338  kill
339  ps
340  ps -aux
341  kill 59494
342  kill 59487
343  ps -aux
344  pskill
345  kill -9 59450
346  pskill
347  ps -aux
348  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
349  source .
350  exit
351  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
352  cat /etc/hosts
353  vim /etc/hosts
354  sudo vim /etc/hosts
355  cd bestande-web-app/ssr-lab-repo-group-2/
356  sudo npm run dev
357  sudo npm run dev > /dev/null &
358  sudo vim /etc/hosts
359  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
360  echo $PORT
361  export PORT=443
362  ps -aux
363  kill -9 59700
364  kill -9 59707
365  sudo npm run dev > /dev/null &
366  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
367  curl -fsSL   [https://staging.bestande.ch](https://staging.bestande.ch/)
368  curl -fsSL  https://staging.bestande.ch/en
369  node --version
370  sudo node --version
371  ss -ltnp
372  npm run dev
373  echo $PORT
374  node --version
375  yarn --version
376  which node
377  ls -la /usr/bin/node
378  history | grep "ln"
379  history | grep "rm"
380  rm /usr/bin/node
381  ln -s /usr/lib/node24/node-v24.0.0-linux-x64/bin/node  /usr/bin/node
382  ln -s /usr/bin/node /usr/lib/node24/node-v24.0.0-linux-x64/bin/node
383  rm /usr/bin/node
384  sudo rm /usr/bin/node
385  ln -s /usr/lib/node24/node-v24.0.0-linux-x64/bin/node  /usr/bin/node
386  sudo ln -s /usr/lib/node24/node-v24.0.0-linux-x64/bin/node  /usr/bin/node
387  node --version
388  npm run dev
389  yarn install
390  npm run dev
391  yarn run dev
392  sudo yarn run dev
393  cat package.json
394  git status
395  rm -rf node/
396  cd /lib/
397  ls
398  which node
399  node --version
400  curl -fsSLO https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz
401  sudp curl -fsSLO https://nodejs.org/dist/v20.6.1/node-v20.6.1-linux-x64.tar.gz
402  sudo su
403  cd /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/
404  npm run dev
405  vim package.json
406  yarn install
407  git status
408  git diff yarn.lock
409  cat patches/@types+react+17.0.4-OLD-patch
410  cat patches/react-native-push-notification+3.1.9-OLD-patch
411  mv patches/react-native-push-notification+3.1.9-OLD-patch patches/react-native-push-notification+3.1.9.patch
412  yarn install
413  sudo rm /usr/bin/node
414  sudo ln -s /lib/node20/bin/node /usr/bin/node
415  node --version
416  sudo rm /usr/bin/node
417  sudo ln -s /lib/node24/node-v24.0.0-linux-x64/bin/node /usr/bin/node
418  node --version
419  yarn install
420  vim package.json
421  yarn install
422  yarn run dev
423  sudo yarn run dev
424  sudo npm run dev
425  npm run dev
426  vim yarn.lock
427  sudo yarn run dev
428  corepack enable
429  yarn corepack enable
430  vim yarn.lock
431  vim package.json
432  sudo yarn run dev
433  sudo yarn run dev > /dev/null &
434  yarn corepack enable
435  curl 127.0.0.1:442
436  curl [http://localhost:443](http://localhost:443/)
437  git status
438  git add patches/@types+react+17.0.4-OLD-patch
439  git add yarn.lock patches/@types+react+17.0.4.patch package.json
440  git commit -m "tentative fix : adjusted node and yarn versions"
441  git push --set-upstream origin main
442  git reset HEAD^
443  git log
444  git status
445  git stash
446  git status
447  ls patches
448  cat package.json
449  vim package.json
450  node --version
451  sudo rm /usr/bin/node
452  history | grep "ln"
453  ln -s /usr/lib/node/node-v20.6.1-linux-x64/bin/node /usr/bin/node
454  sudo ln -s /usr/lib/node/node-v20.6.1-linux-x64/bin/node /usr/bin/node
455  node --version
456  npm --version
457  npm -v
458  npm install
459  npm --help
460  which npm
461  ln /usr/bin/npm
462  ls -la /usr/bin/npm
463  rm /usr/bin/npm
464  sudo rm /usr/bin/npm
465  /lib/node20/bin/npm -c
466  /lib/node20/bin/npm -v
467  ln -s /lib/node20/bin/npm /usr/bin/npm
468  sudo ln -s /lib/node20/bin/npm /usr/bin/npm
469  npm run dev
470  sudo npm run dev
471  sudo npm run dev > /dev/null &
472  sudo npm run dev > /dev/null 2>&1  &
473  curl [https://staging.bestande.ch](https://staging.bestande.ch/) -v
474  curl -k [https://staging.bestande.ch](https://staging.bestande.ch/) -v
475  which npm
476  exit
477  cat /etc/hosts
478  ss -to
479  ps -aux
480  curl -k [https://staging.bestande.ch](https://staging.bestande.ch/)
481  ps -aux
482  curl -k [https://staging.bestande.ch](https://staging.bestande.ch/)
483  ps aux
484  ss -to
485  exit
486  [http://localhost:3001](http://localhost:3001/)
487  exit
488  clear
489  exit
490  ss -to
491  ss -tol
492  ss -ltnp | grep 3000
493  ss -ltnp | grep https
494  ss -ltnp | grep http
495  ss -ltnp | grep 443
496  exit
497  pat --version
498  apt --version
499  yarn --version
500  npm --version
501  history
502  cd bestande-web-app/ssr-lab-repo-group-2/
503  git status
504  rm patches/@types+react+17.0.4-OLD-patch
505  git log
506  git push --force
507  git push
508  git push --force
509  cat package.json
510  vim package.json
511  history
512  exit
513  history
514  clear
515  history
516  clear
517  history
518  exi
519  exit
520  cat .bash_history
521  vim .bash_history
522  ls bestande-web-app/ssr-lab-repo-group-2/patch
523  ls bestande-web-app/ssr-lab-repo-group-2/patches
524  exit
525  git log -p patches/
526  cd bestande-web-app/ssr-lab-repo-group-2/
527  git log -p patches/
528  git log patches/
529  vim package.json
530  yarn instal
531  yarn install
532  node --versio
533  node --version
534  npm install
535  npm -v
536  rm /usr/bin/node
537  sudo rm /usr/bin/node
538  ln -s /lib/node24/node-v24.0.0-linux-x64/bin/node /usr/bin/node
539  sudo ln -s /lib/node24/node-v24.0.0-linux-x64/bin/node /usr/bin/node
540  sudo rm /usr/bin/npm
541  sudo ln -s /lib/node24/node-v24.0.0-linux-x64/bin/npm /usr/bin/npm
542  npm -version
543  vim package.json
544  yarn install
545  ps aux
546  kill -9 61787
547  sudo kill -9 61787
548  sudo kill -9 61700
549  kill -9 61787
550  ps aux
551  sudo kill -9 61731
552  ps aux
553  sudo kill -9 59744 59745 59752
554  ps aux
555  sudo kill -9 61230 61187  61194  61230 61231  61238 61788 61798 61808
556  ps aux
557  npm run dev
558  echo $PORT
559  export PORT=443
560  sudo npm run dev
561  sudo npm run dev > /dev/null 2>&1 &
562  cat package.json
563  npm -v
564  ls
565  ls -la
566  git status
567  cat yarn.lock
568  vim yarn.lock
569  vim pack

### Prompts

dirty node version download with curl from their official repository and unpacking in ubuntu

cmd to download yarn directly from the project repository and unpack

what are patches in nodejs web applications e.g.

error → node: --openssl-legacy-provider is not allowed in NODE_OPTIONS. Which options are deprecated from node 20 to 24

point me to mongodb distributions repository - full packages

ssh tunnel - it is basically port forwarding? - explain the relevant ssh cmd options

how to apply the patch changes

> @jonny/bestande@5.0.0 dev > cd web && cross-env NODE_ENV=development ts-node-dev --transpile-only src/index.ts [INFO] 14:52:21 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 4.4.4) /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/node_modules/firebase-admin/lib/app/firebase-namespace.js:84 this.INTERNAL = new FirebaseNamespaceInternals(appStore ?? new lifecycle_1.AppStore()); ^ SyntaxError: Unexpected token '?' at wrapSafe (internal/modules/cjs/loader.js:915:16) at Module._compile (internal/modules/cjs/loader.js:963:27) at Module._compile (/home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/node_modules/source-map-support/source-map-support.js:568:25) at Module._extensions..js (internal/modules/cjs/loader.js:1027:10) at Object.nodeDevHook [as .js] (/home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/node_modules/ts-node-dev/lib/hook.js:63:13) at Module.load (internal/modules/cjs/loader.js:863:32) at Function.Module._load (internal/modules/cjs/loader.js:708:14) at Module.require (internal/modules/cjs/loader.js:887:19) at require (internal/modules/cjs/helpers.js:85:18) at Object.<anonymous> (/home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/node_modules/firebase-admin/lib/default-namespace.js:19:30) [ERROR] 14:52:24 SyntaxError: Unexpected token '?' (node:59903) NOTE: The AWS SDK for JavaScript (v2) has reached end-of-support. It will no longer receive updates or releases. Please migrate your code to use AWS SDK for JavaScript (v3). For more information, check the blog post at https://a.co/cUPnyil 
this is showing when usng npm run dev? why would that be

### MongoDB

Mongod commands to create the database bestande and the collections modules and ratings.: 

```jsx
use bestande
db.createCollection('modules')
db.createCollection('ratings')
```

Mongod commands to import the files into their respective collections:
```jsx
db.ratings.countDocuments()
db.modules.countDocuments()
```

```jsx
mongoimport --db bestande --collection modules --file /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data/updated_modules_including_FS25_final.json  --jsonArray

mongoimport --db bestande --collection ratings --file /home/ubuntu/bestande-web-app/ssr-lab-repo-group-2/db_backup_data/updated_ratings_including_FS24_final.json  --jsonArray

```

And we checked that they were imported with these commands: