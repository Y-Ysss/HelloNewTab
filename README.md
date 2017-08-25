Hello New Tab
====
Google Chromeの拡張機能で、ブックマークに即座にアクセスできるスタートページ。

## 使用方法
###
Google Chrome(またはChromiumベースブラウザ)で新しいタブを開くと「Hello NewTab」に置き替わる。ブックマークをフォルダー毎に表示できる。

###
フォルダー名の先頭を「'」（半角のシングルクォーテーション）にすることでフォルダーを非表示にできる。右上のボタンをクリックすることで非表示のフォルダーを表示することができる。

## インストール
1. Google Chrome（またはChromiumベースブラウザ）を起動し、アドレスバーに“chrome://extensions” と入力しエンターキーを押す。
2. その画面のデベロッパーモードのチェックボックスをクリックし、有効にする。有効にするとChrome Web Store以外からも簡単に拡張機能をインストールすることができる。
3. ファイルエクスプローラーでダウンロードしたZIPファイルを見つけ、選択して右クリックをし「すべて展開」をする。
4. 拡張機能ページを表示し、右上の「デベロッパーモード」のチェックボックスがオンになっていることを確認する。
5. 拡張機能ページの「拡張機能のパッケージ化」をクリックすると、ダイアログが開く。
6. ダイアログの「拡張機能のルート ディレクトリ」のフォームに展開したファイルのパスを指定する。（例 Cドライブ直下に解凍した場合 C:\HelloNewTab-master）その後「拡張機能のパッケージ化」をクリック。 インストールする拡張子である「.crx」ファイルと、秘密鍵を含む「.pem」ファイルの2つのファイルが作成される。
7. 拡張機能ページを表示し、作成された「.crx」ファイルをドラッグアンドドロップすることでインストールすることができる。

## 不具合
Vivaldi ブラウザ使用時、ブックマーク検索のパフォーマンスが低下。キー入力のもたつき。自分のGoogle Chromeでは正常に動作。

### 追記
バージョン1.11以前のVivaldi ブラウザの場合 : 
1. デベロッパーモードを有効にする。
2. 拡張機能のIDをコピーし、次のURLのアスタリスクに追加する(chrome-extension://************/newtab.html)。
3. そのURLをアドレスバーに入力しエンターキーを押す。


___

Hello New Tab
====

This is Google Chrome Extension. Startpage giving instant access to bookmarks.

## Description
For all those who are in search for a cool way to access your bookmarks, this sleek-looking extension is what you've been looking for.  

## Usage
###
Open New Tab in Google Chrome (or Chromium based Browser). Now you will see a "Hello New Tab" page. In this page, your bookmarks are daiplayed for each folders. Click the bookmark name or icon, the page opens in a new tab.

###
If first letter of folder name is " ' "(single quotation mark), hide this folder in "Hello New Tab" page. When click the button in the upper right, display this hidden folder.

## Install
1. Open Google Chrome (or Chromium based Browser), type “chrome://extensions” in the address bar and press the “Enter” key.
Enable developer mode extensions.
2. Now you will see a checkbox with the label “developer mode”. Check the checkbox and now you can easily install any extension that’s not coming from the Chrome Web Store.
3. Open File Explorer and find the zipped folder.To unzip the folder, select the zipped folder and right-click it, select Extract All, and then follow the instructions.
4. Open the extensions page. Ensure that the "Developer mode" checkbox in the top right-hand corner is checked.
5. Click the “Pack extension” button. A dialog appears.
6. In the “Extension root directory” field, specify the path to the extension's folder—for example, C:\ｍｙExtension. (Ignore the other field; you don't specify a private key file the first time you package a particular extension.) Click Package. The packager creates two files: a “.crx” file, which is the actual extension that can be installed, and a “.pem” file, which contains the private key.
7. Now drag and drop your “.crx” files on the “extensions” page to install them.

## Bug
If you use Vivaldi browser, Performance of bookmark search decreases. Key input reaction time is long. In the case of my Google Chrome, it functions normally

### Notes
If you use Vivaldi browser before version 1.11 : 
1. Enable “developer mode”.
2. Copy Extension ID and add to the asterisk of the this URL (chrome-extension://************/newtab.html).
3. Type “chrome-extension://************/newtab.html” in address bar and press the “Enter” key.
