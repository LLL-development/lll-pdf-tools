/* Lightweight i18n: EN / 日本語 / 简体中文 */
(function () {
  const STRINGS = {
    en: {
      "nav.brand": "LLL PDF Toolkit",
      "lang.name": "English",
      "hero.badge": "13 free PDF tools, right in your browser",
      "hero.title.1": "Every PDF tool you need,",
      "hero.title.2": "in one place",
      "hero.subtitle":
        "Merge, split, compress, convert and protect your PDFs. Everything runs locally in your browser — your files are never uploaded to a server.",
      "tools.heading": "Choose a tool",
      "tools.subheading": "Click a card to get started",

      "tool.merge.title": "Merge PDF",
      "tool.merge.desc": "Combine multiple PDFs into a single file",
      "tool.split.title": "Split PDF",
      "tool.split.desc": "Break a PDF into several smaller files",
      "tool.rotate.title": "Rotate PDF",
      "tool.rotate.desc": "Rotate one or every page in a document",
      "tool.compress.title": "Compress PDF",
      "tool.compress.desc": "Shrink file size while keeping quality",
      "tool.lock.title": "Lock PDF",
      "tool.lock.desc": "Protect a PDF with a password",
      "tool.unlock.title": "Unlock PDF",
      "tool.unlock.desc": "Remove password protection from a PDF",
      "tool.delete.title": "Delete pages",
      "tool.delete.desc": "Remove unwanted pages from a PDF",
      "tool.rearrange.title": "Rearrange pages",
      "tool.rearrange.desc": "Drag and drop to reorder pages",
      "tool.extract.title": "Extract pages",
      "tool.extract.desc": "Pull selected pages into a new PDF",
      "tool.pdf2word.title": "PDF to Word",
      "tool.pdf2word.desc": "Convert a PDF's text into a .docx file",
      "tool.word2pdf.title": "Word to PDF",
      "tool.word2pdf.desc": "Convert a .docx document into a PDF",
      "tool.excel2pdf.title": "Excel to PDF",
      "tool.excel2pdf.desc": "Convert spreadsheets into a PDF",
      "tool.ppt2pdf.title": "PowerPoint to PDF",
      "tool.ppt2pdf.desc": "Convert slide text into a PDF",

      "common.back": "Back to all tools",
      "common.chooseFiles": "Click to upload",
      "common.orDrop": "or drag and drop",
      "common.dropHerePdf": "PDF files only",
      "common.dropHerePdfSingle": "One PDF file",
      "common.dropHereDocx": ".docx files only",
      "common.dropHereXlsx": ".xlsx / .xls / .csv files only",
      "common.dropHerePptx": ".pptx files only",
      "common.remove": "Remove",
      "common.processing": "Processing…",
      "common.download": "Download",
      "common.downloadAgain": "Download again",
      "common.downloadZip": "Download .zip",
      "common.startOver": "Start over",
      "common.done": "All done",
      "common.doneDesc": "Your file is ready to download.",
      "common.privacyNotice":
        "Everything happens on your device — files are never sent to a server.",
      "common.needFile": "Please add a file to continue.",
      "common.needTwoFiles": "Please add at least two PDF files to merge.",
      "common.invalidPdf":
        "That file couldn't be read as a PDF. Please choose a valid PDF file.",
      "common.genericError":
        "Something went wrong while processing your file. Please try again.",
      "common.pages": "pages",
      "common.page": "Page",

      "merge.title": "Merge PDF",
      "merge.subtitle": "Combine multiple PDFs into one, in the order you choose",
      "merge.dropLabel": "Upload PDFs to merge",
      "merge.reorderHint": "Drag files to change the merge order",
      "merge.action": "Merge PDFs",
      "merge.resultTitle": "PDFs merged successfully",
      "merge.resultDesc": "merged.pdf is ready",

      "split.title": "Split PDF",
      "split.subtitle": "Turn one PDF into several smaller files",
      "split.dropLabel": "Upload a PDF to split",
      "split.mode.label": "Split method",
      "split.mode.ranges": "Custom ranges",
      "split.mode.every": "Every N pages",
      "split.mode.single": "Extract every page separately",
      "split.ranges.label": "Page ranges (e.g. 1-3, 4, 5-6)",
      "split.ranges.placeholder": "1-3, 4-5",
      "split.every.label": "Pages per file",
      "split.action": "Split PDF",
      "split.resultTitle": "PDF split successfully",
      "split.resultDesc": "files created",

      "rotate.title": "Rotate PDF",
      "rotate.subtitle": "Click a page to rotate it, or rotate all pages at once",
      "rotate.dropLabel": "Upload a PDF to rotate",
      "rotate.rotateAllLeft": "Rotate all left",
      "rotate.rotateAllRight": "Rotate all right",
      "rotate.hint": "Use the arrows on a page, or rotate all pages",
      "rotate.action": "Save rotated PDF",
      "rotate.resultTitle": "PDF rotated successfully",

      "delete.title": "Delete pages",
      "delete.subtitle": "Select the pages you want to remove",
      "delete.dropLabel": "Upload a PDF to edit",
      "delete.hint": "Click a page to mark it for deletion",
      "delete.selectedCount": "pages marked for deletion",
      "delete.action": "Delete marked pages",
      "delete.resultTitle": "Pages deleted successfully",
      "delete.errorAll": "You can't delete every page in the document.",

      "rearrange.title": "Rearrange pages",
      "rearrange.subtitle": "Drag pages into the order you want",
      "rearrange.dropLabel": "Upload a PDF to reorder",
      "rearrange.hint": "Drag and drop thumbnails to reorder pages",
      "rearrange.action": "Save new order",
      "rearrange.resultTitle": "Pages reordered successfully",

      "extract.title": "Extract pages",
      "extract.subtitle": "Select the pages you want to keep as a new PDF",
      "extract.dropLabel": "Upload a PDF to extract from",
      "extract.hint": "Click pages to select them",
      "extract.selectAll": "Select all",
      "extract.clear": "Clear selection",
      "extract.selectedCount": "pages selected",
      "extract.action": "Extract selected pages",
      "extract.resultTitle": "Pages extracted successfully",
      "extract.errorNone": "Select at least one page to extract.",

      "compress.title": "Compress PDF",
      "compress.subtitle": "Reduce file size by re-compressing content and images",
      "compress.dropLabel": "Upload a PDF to compress",
      "compress.level.label": "Compression level",
      "compress.level.low": "Low — best quality",
      "compress.level.medium": "Medium — recommended",
      "compress.level.high": "High — smallest size",
      "compress.action": "Compress PDF",
      "compress.resultTitle": "PDF compressed successfully",
      "compress.savedPrefix": "Reduced from",
      "compress.savedMiddle": "to",
      "compress.savedSuffix": "",
      "compress.noSavings":
        "This PDF is already well optimized — little extra savings were possible.",

      "lock.title": "Lock PDF",
      "lock.subtitle": "Add a password and permissions to a PDF",
      "lock.dropLabel": "Upload a PDF to protect",
      "lock.password.label": "Password to open the file",
      "lock.password.placeholder": "Enter a password",
      "lock.confirm.label": "Confirm password",
      "lock.confirm.placeholder": "Re-enter the password",
      "lock.permissions.label": "Permissions",
      "lock.permissions.printing": "Allow printing",
      "lock.permissions.copying": "Allow copying text",
      "lock.permissions.modifying": "Allow editing",
      "lock.permissions.annotating": "Allow comments / annotations",
      "lock.action": "Lock PDF",
      "lock.resultTitle": "PDF locked successfully",
      "lock.errorMismatch": "Passwords don't match.",
      "lock.errorEmpty": "Please enter a password.",

      "unlock.title": "Unlock PDF",
      "unlock.subtitle": "Remove password protection from a PDF you can open",
      "unlock.dropLabel": "Upload a protected PDF",
      "unlock.password.label": "Current password",
      "unlock.password.placeholder": "Enter the PDF's password",
      "unlock.action": "Unlock PDF",
      "unlock.resultTitle": "PDF unlocked successfully",
      "unlock.errorWrongPassword":
        "That password didn't work. Please check it and try again.",
      "unlock.errorNotEncrypted": "This PDF isn't password protected.",

      "pdf2word.title": "PDF to Word",
      "pdf2word.subtitle": "Extract text from a PDF into an editable .docx file",
      "pdf2word.dropLabel": "Upload a PDF to convert",
      "pdf2word.action": "Convert to Word",
      "pdf2word.resultTitle": "Converted to Word",
      "pdf2word.notice":
        "Text is extracted page by page. Complex layouts, columns and images are not preserved.",

      "word2pdf.title": "Word to PDF",
      "word2pdf.subtitle": "Convert a .docx document into a PDF",
      "word2pdf.dropLabel": "Upload a .docx file to convert",
      "word2pdf.action": "Convert to PDF",
      "word2pdf.resultTitle": "Converted to PDF",
      "word2pdf.notice":
        "Basic text formatting is preserved. Complex layouts may render differently.",

      "excel2pdf.title": "Excel to PDF",
      "excel2pdf.subtitle": "Convert spreadsheet sheets into a PDF, one per page",
      "excel2pdf.dropLabel": "Upload a spreadsheet to convert",
      "excel2pdf.action": "Convert to PDF",
      "excel2pdf.resultTitle": "Converted to PDF",
      "excel2pdf.notice":
        "Each sheet is rendered as a table. Very wide sheets are scaled to fit the page.",

      "ppt2pdf.title": "PowerPoint to PDF",
      "ppt2pdf.subtitle": "Convert slide text into a simple PDF, one slide per page",
      "ppt2pdf.dropLabel": "Upload a .pptx file to convert",
      "ppt2pdf.action": "Convert to PDF",
      "ppt2pdf.resultTitle": "Converted to PDF",
      "ppt2pdf.notice":
        "This is a text-only conversion — images, transitions and custom layouts from the original slides are not reproduced.",

      "footer.tagline": "Free, private PDF tools that run entirely in your browser.",
      "footer.rights": "All processing happens locally. No files ever leave your device.",
    },

    ja: {
      "nav.brand": "LLL PDFツールキット",
      "lang.name": "日本語",
      "hero.badge": "ブラウザだけで使える無料PDFツール13種",
      "hero.title.1": "必要なPDFツールが",
      "hero.title.2": "すべてここに",
      "hero.subtitle":
        "PDFの結合・分割・圧縮・変換・保護をまとめて。すべての処理はブラウザ内で完結し、ファイルがサーバーに送信されることはありません。",
      "tools.heading": "ツールを選択",
      "tools.subheading": "カードをクリックして開始",

      "tool.merge.title": "PDF結合",
      "tool.merge.desc": "複数のPDFを1つのファイルにまとめます",
      "tool.split.title": "PDF分割",
      "tool.split.desc": "PDFを複数の小さなファイルに分割します",
      "tool.rotate.title": "PDF回転",
      "tool.rotate.desc": "ページ単位、または全ページを回転します",
      "tool.compress.title": "PDF圧縮",
      "tool.compress.desc": "画質を保ちながらファイルサイズを縮小します",
      "tool.lock.title": "PDFにロック",
      "tool.lock.desc": "パスワードでPDFを保護します",
      "tool.unlock.title": "PDFのロック解除",
      "tool.unlock.desc": "PDFのパスワード保護を解除します",
      "tool.delete.title": "ページを削除",
      "tool.delete.desc": "不要なページをPDFから削除します",
      "tool.rearrange.title": "ページを並べ替え",
      "tool.rearrange.desc": "ドラッグ＆ドロップでページ順を変更します",
      "tool.extract.title": "ページを抽出",
      "tool.extract.desc": "選択したページを新しいPDFとして抽出します",
      "tool.pdf2word.title": "PDFからWord",
      "tool.pdf2word.desc": "PDFのテキストを.docxファイルに変換します",
      "tool.word2pdf.title": "WordからPDF",
      "tool.word2pdf.desc": ".docx文書をPDFに変換します",
      "tool.excel2pdf.title": "ExcelからPDF",
      "tool.excel2pdf.desc": "表計算ファイルをPDFに変換します",
      "tool.ppt2pdf.title": "PowerPointからPDF",
      "tool.ppt2pdf.desc": "スライドのテキストをPDFに変換します",

      "common.back": "ツール一覧に戻る",
      "common.chooseFiles": "クリックしてアップロード",
      "common.orDrop": "またはドラッグ＆ドロップ",
      "common.dropHerePdf": "PDFファイルのみ対応",
      "common.dropHerePdfSingle": "PDFファイル1つ",
      "common.dropHereDocx": ".docxファイルのみ対応",
      "common.dropHereXlsx": ".xlsx / .xls / .csvファイルのみ対応",
      "common.dropHerePptx": ".pptxファイルのみ対応",
      "common.remove": "削除",
      "common.processing": "処理中…",
      "common.download": "ダウンロード",
      "common.downloadAgain": "もう一度ダウンロード",
      "common.downloadZip": ".zipをダウンロード",
      "common.startOver": "最初からやり直す",
      "common.done": "完了しました",
      "common.doneDesc": "ファイルの準備ができました。",
      "common.privacyNotice":
        "すべての処理はお使いの端末内で行われ、ファイルがサーバーに送信されることはありません。",
      "common.needFile": "続行するにはファイルを追加してください。",
      "common.needTwoFiles": "結合するには2つ以上のPDFファイルを追加してください。",
      "common.invalidPdf":
        "このファイルはPDFとして読み込めませんでした。有効なPDFファイルを選択してください。",
      "common.genericError":
        "ファイルの処理中に問題が発生しました。もう一度お試しください。",
      "common.pages": "ページ",
      "common.page": "ページ",

      "merge.title": "PDF結合",
      "merge.subtitle": "選んだ順序で複数のPDFを1つに結合します",
      "merge.dropLabel": "結合するPDFをアップロード",
      "merge.reorderHint": "ファイルをドラッグして結合順を変更できます",
      "merge.action": "PDFを結合",
      "merge.resultTitle": "PDFの結合が完了しました",
      "merge.resultDesc": "merged.pdf の準備ができました",

      "split.title": "PDF分割",
      "split.subtitle": "1つのPDFを複数の小さなファイルに分割します",
      "split.dropLabel": "分割するPDFをアップロード",
      "split.mode.label": "分割方法",
      "split.mode.ranges": "ページ範囲を指定",
      "split.mode.every": "N ページごと",
      "split.mode.single": "すべてのページを個別に抽出",
      "split.ranges.label": "ページ範囲（例: 1-3, 4, 5-6）",
      "split.ranges.placeholder": "1-3, 4-5",
      "split.every.label": "1ファイルあたりのページ数",
      "split.action": "PDFを分割",
      "split.resultTitle": "PDFの分割が完了しました",
      "split.resultDesc": "個のファイルを作成しました",

      "rotate.title": "PDF回転",
      "rotate.subtitle": "ページをクリックして回転、または全ページをまとめて回転",
      "rotate.dropLabel": "回転するPDFをアップロード",
      "rotate.rotateAllLeft": "すべて左に回転",
      "rotate.rotateAllRight": "すべて右に回転",
      "rotate.hint": "各ページの矢印、または一括回転ボタンを使用してください",
      "rotate.action": "回転を保存",
      "rotate.resultTitle": "PDFの回転が完了しました",

      "delete.title": "ページを削除",
      "delete.subtitle": "削除したいページを選択してください",
      "delete.dropLabel": "編集するPDFをアップロード",
      "delete.hint": "クリックして削除するページを選択します",
      "delete.selectedCount": "ページが削除対象に選択されています",
      "delete.action": "選択したページを削除",
      "delete.resultTitle": "ページの削除が完了しました",
      "delete.errorAll": "すべてのページを削除することはできません。",

      "rearrange.title": "ページを並べ替え",
      "rearrange.subtitle": "ページをドラッグして順序を変更します",
      "rearrange.dropLabel": "並べ替えるPDFをアップロード",
      "rearrange.hint": "サムネイルをドラッグ＆ドロップして並べ替えます",
      "rearrange.action": "新しい順序を保存",
      "rearrange.resultTitle": "ページの並べ替えが完了しました",

      "extract.title": "ページを抽出",
      "extract.subtitle": "新しいPDFとして残したいページを選択します",
      "extract.dropLabel": "抽出元のPDFをアップロード",
      "extract.hint": "クリックしてページを選択します",
      "extract.selectAll": "すべて選択",
      "extract.clear": "選択解除",
      "extract.selectedCount": "ページを選択中",
      "extract.action": "選択したページを抽出",
      "extract.resultTitle": "ページの抽出が完了しました",
      "extract.errorNone": "抽出するページを1つ以上選択してください。",

      "compress.title": "PDF圧縮",
      "compress.subtitle": "コンテンツと画像を再圧縮してファイルサイズを縮小します",
      "compress.dropLabel": "圧縮するPDFをアップロード",
      "compress.level.label": "圧縮レベル",
      "compress.level.low": "低 — 高画質優先",
      "compress.level.medium": "中 — おすすめ",
      "compress.level.high": "高 — 最小サイズ優先",
      "compress.action": "PDFを圧縮",
      "compress.resultTitle": "PDFの圧縮が完了しました",
      "compress.savedPrefix": "サイズを",
      "compress.savedMiddle": "から",
      "compress.savedSuffix": "に削減しました",
      "compress.noSavings":
        "このPDFはすでに最適化されており、大幅な削減はできませんでした。",

      "lock.title": "PDFにロック",
      "lock.subtitle": "PDFにパスワードと権限設定を追加します",
      "lock.dropLabel": "保護するPDFをアップロード",
      "lock.password.label": "ファイルを開くためのパスワード",
      "lock.password.placeholder": "パスワードを入力",
      "lock.confirm.label": "パスワードの確認",
      "lock.confirm.placeholder": "パスワードをもう一度入力",
      "lock.permissions.label": "権限設定",
      "lock.permissions.printing": "印刷を許可",
      "lock.permissions.copying": "テキストのコピーを許可",
      "lock.permissions.modifying": "編集を許可",
      "lock.permissions.annotating": "コメント・注釈を許可",
      "lock.action": "PDFをロック",
      "lock.resultTitle": "PDFのロックが完了しました",
      "lock.errorMismatch": "パスワードが一致しません。",
      "lock.errorEmpty": "パスワードを入力してください。",

      "unlock.title": "PDFのロック解除",
      "unlock.subtitle": "開くことができるPDFのパスワード保護を解除します",
      "unlock.dropLabel": "保護されたPDFをアップロード",
      "unlock.password.label": "現在のパスワード",
      "unlock.password.placeholder": "PDFのパスワードを入力",
      "unlock.action": "PDFのロックを解除",
      "unlock.resultTitle": "PDFのロック解除が完了しました",
      "unlock.errorWrongPassword":
        "パスワードが正しくありません。確認してもう一度お試しください。",
      "unlock.errorNotEncrypted": "このPDFはパスワードで保護されていません。",

      "pdf2word.title": "PDFからWord",
      "pdf2word.subtitle": "PDFのテキストを編集可能な.docxファイルに変換します",
      "pdf2word.dropLabel": "変換するPDFをアップロード",
      "pdf2word.action": "Wordに変換",
      "pdf2word.resultTitle": "Wordへの変換が完了しました",
      "pdf2word.notice":
        "テキストはページ単位で抽出されます。複雑なレイアウト、段組み、画像は保持されません。",

      "word2pdf.title": "WordからPDF",
      "word2pdf.subtitle": ".docx文書をPDFに変換します",
      "word2pdf.dropLabel": "変換する.docxファイルをアップロード",
      "word2pdf.action": "PDFに変換",
      "word2pdf.resultTitle": "PDFへの変換が完了しました",
      "word2pdf.notice":
        "基本的な書式は保持されますが、複雑なレイアウトは異なって表示される場合があります。",

      "excel2pdf.title": "ExcelからPDF",
      "excel2pdf.subtitle": "各シートを1ページのPDFに変換します",
      "excel2pdf.dropLabel": "変換する表計算ファイルをアップロード",
      "excel2pdf.action": "PDFに変換",
      "excel2pdf.resultTitle": "PDFへの変換が完了しました",
      "excel2pdf.notice":
        "各シートは表として描画されます。幅が広いシートはページに収まるよう縮小されます。",

      "ppt2pdf.title": "PowerPointからPDF",
      "ppt2pdf.subtitle": "スライドのテキストを1ページ1スライドのPDFに変換します",
      "ppt2pdf.dropLabel": "変換する.pptxファイルをアップロード",
      "ppt2pdf.action": "PDFに変換",
      "ppt2pdf.resultTitle": "PDFへの変換が完了しました",
      "ppt2pdf.notice":
        "テキストのみの変換です。元のスライドの画像、切り替え効果、独自レイアウトは再現されません。",

      "footer.tagline": "ブラウザだけで完結する、無料でプライベートなPDFツール。",
      "footer.rights": "すべての処理は端末内で行われ、ファイルが外部に送信されることはありません。",
    },

    zh: {
      "nav.brand": "LLL PDF 工具箱",
      "lang.name": "简体中文",
      "hero.badge": "13 款免费 PDF 工具，完全在浏览器中运行",
      "hero.title.1": "你需要的所有 PDF 工具",
      "hero.title.2": "都在这里",
      "hero.subtitle":
        "合并、拆分、压缩、转换和加密 PDF 文件。所有处理都在浏览器本地完成，文件不会上传到任何服务器。",
      "tools.heading": "选择一个工具",
      "tools.subheading": "点击卡片即可开始",

      "tool.merge.title": "合并 PDF",
      "tool.merge.desc": "将多个 PDF 文件合并为一个文件",
      "tool.split.title": "拆分 PDF",
      "tool.split.desc": "将一个 PDF 拆分成多个较小的文件",
      "tool.rotate.title": "旋转 PDF",
      "tool.rotate.desc": "旋转单页或文档中的所有页面",
      "tool.compress.title": "压缩 PDF",
      "tool.compress.desc": "在保持质量的同时缩小文件体积",
      "tool.lock.title": "加密 PDF",
      "tool.lock.desc": "为 PDF 添加密码保护",
      "tool.unlock.title": "解密 PDF",
      "tool.unlock.desc": "移除 PDF 的密码保护",
      "tool.delete.title": "删除页面",
      "tool.delete.desc": "从 PDF 中移除不需要的页面",
      "tool.rearrange.title": "重排页面",
      "tool.rearrange.desc": "拖拽调整页面顺序",
      "tool.extract.title": "提取页面",
      "tool.extract.desc": "将选定页面提取为新的 PDF",
      "tool.pdf2word.title": "PDF 转 Word",
      "tool.pdf2word.desc": "将 PDF 中的文字转换为 .docx 文件",
      "tool.word2pdf.title": "Word 转 PDF",
      "tool.word2pdf.desc": "将 .docx 文档转换为 PDF",
      "tool.excel2pdf.title": "Excel 转 PDF",
      "tool.excel2pdf.desc": "将电子表格转换为 PDF",
      "tool.ppt2pdf.title": "PPT 转 PDF",
      "tool.ppt2pdf.desc": "将幻灯片文字转换为 PDF",

      "common.back": "返回工具列表",
      "common.chooseFiles": "点击上传",
      "common.orDrop": "或拖拽文件到此处",
      "common.dropHerePdf": "仅支持 PDF 文件",
      "common.dropHerePdfSingle": "一个 PDF 文件",
      "common.dropHereDocx": "仅支持 .docx 文件",
      "common.dropHereXlsx": "仅支持 .xlsx / .xls / .csv 文件",
      "common.dropHerePptx": "仅支持 .pptx 文件",
      "common.remove": "移除",
      "common.processing": "处理中…",
      "common.download": "下载",
      "common.downloadAgain": "再次下载",
      "common.downloadZip": "下载 .zip",
      "common.startOver": "重新开始",
      "common.done": "处理完成",
      "common.doneDesc": "文件已准备好，可以下载了。",
      "common.privacyNotice": "所有处理均在你的设备本地完成，文件不会发送到任何服务器。",
      "common.needFile": "请先添加一个文件。",
      "common.needTwoFiles": "请至少添加两个 PDF 文件以进行合并。",
      "common.invalidPdf": "无法将该文件读取为 PDF，请选择一个有效的 PDF 文件。",
      "common.genericError": "处理文件时出现问题，请重试。",
      "common.pages": "页",
      "common.page": "第",

      "merge.title": "合并 PDF",
      "merge.subtitle": "按你选择的顺序将多个 PDF 合并为一个",
      "merge.dropLabel": "上传要合并的 PDF",
      "merge.reorderHint": "拖拽文件可调整合并顺序",
      "merge.action": "合并 PDF",
      "merge.resultTitle": "PDF 合并成功",
      "merge.resultDesc": "merged.pdf 已生成",

      "split.title": "拆分 PDF",
      "split.subtitle": "将一个 PDF 拆分为多个较小的文件",
      "split.dropLabel": "上传要拆分的 PDF",
      "split.mode.label": "拆分方式",
      "split.mode.ranges": "自定义范围",
      "split.mode.every": "每 N 页拆分",
      "split.mode.single": "将每一页单独提取",
      "split.ranges.label": "页码范围（例如 1-3, 4, 5-6）",
      "split.ranges.placeholder": "1-3, 4-5",
      "split.every.label": "每个文件的页数",
      "split.action": "拆分 PDF",
      "split.resultTitle": "PDF 拆分成功",
      "split.resultDesc": "个文件已生成",

      "rotate.title": "旋转 PDF",
      "rotate.subtitle": "点击页面旋转，或一次旋转所有页面",
      "rotate.dropLabel": "上传要旋转的 PDF",
      "rotate.rotateAllLeft": "全部向左旋转",
      "rotate.rotateAllRight": "全部向右旋转",
      "rotate.hint": "使用页面上的箭头，或一键旋转所有页面",
      "rotate.action": "保存旋转结果",
      "rotate.resultTitle": "PDF 旋转成功",

      "delete.title": "删除页面",
      "delete.subtitle": "选择你想要删除的页面",
      "delete.dropLabel": "上传要编辑的 PDF",
      "delete.hint": "点击页面即可标记为删除",
      "delete.selectedCount": "页已标记删除",
      "delete.action": "删除已标记页面",
      "delete.resultTitle": "页面删除成功",
      "delete.errorAll": "不能删除文档中的所有页面。",

      "rearrange.title": "重排页面",
      "rearrange.subtitle": "拖拽页面以调整顺序",
      "rearrange.dropLabel": "上传要重排的 PDF",
      "rearrange.hint": "拖拽缩略图即可调整页面顺序",
      "rearrange.action": "保存新顺序",
      "rearrange.resultTitle": "页面重排成功",

      "extract.title": "提取页面",
      "extract.subtitle": "选择希望保留到新 PDF 中的页面",
      "extract.dropLabel": "上传要提取的 PDF",
      "extract.hint": "点击页面即可选中",
      "extract.selectAll": "全选",
      "extract.clear": "清除选择",
      "extract.selectedCount": "页已选中",
      "extract.action": "提取选中页面",
      "extract.resultTitle": "页面提取成功",
      "extract.errorNone": "请至少选择一页进行提取。",

      "compress.title": "压缩 PDF",
      "compress.subtitle": "通过重新压缩内容和图片来减小文件体积",
      "compress.dropLabel": "上传要压缩的 PDF",
      "compress.level.label": "压缩级别",
      "compress.level.low": "低 — 画质优先",
      "compress.level.medium": "中 — 推荐",
      "compress.level.high": "高 — 体积最小",
      "compress.action": "压缩 PDF",
      "compress.resultTitle": "PDF 压缩成功",
      "compress.savedPrefix": "已从",
      "compress.savedMiddle": "压缩至",
      "compress.savedSuffix": "",
      "compress.noSavings": "该 PDF 已经过优化，压缩空间有限。",

      "lock.title": "加密 PDF",
      "lock.subtitle": "为 PDF 添加密码和权限设置",
      "lock.dropLabel": "上传要加密的 PDF",
      "lock.password.label": "打开文件所需的密码",
      "lock.password.placeholder": "输入密码",
      "lock.confirm.label": "确认密码",
      "lock.confirm.placeholder": "再次输入密码",
      "lock.permissions.label": "权限设置",
      "lock.permissions.printing": "允许打印",
      "lock.permissions.copying": "允许复制文本",
      "lock.permissions.modifying": "允许编辑",
      "lock.permissions.annotating": "允许批注 / 注释",
      "lock.action": "加密 PDF",
      "lock.resultTitle": "PDF 加密成功",
      "lock.errorMismatch": "两次输入的密码不一致。",
      "lock.errorEmpty": "请输入密码。",

      "unlock.title": "解密 PDF",
      "unlock.subtitle": "移除你可以打开的 PDF 的密码保护",
      "unlock.dropLabel": "上传受保护的 PDF",
      "unlock.password.label": "当前密码",
      "unlock.password.placeholder": "输入该 PDF 的密码",
      "unlock.action": "解密 PDF",
      "unlock.resultTitle": "PDF 解密成功",
      "unlock.errorWrongPassword": "密码不正确，请检查后重试。",
      "unlock.errorNotEncrypted": "该 PDF 未设置密码保护。",

      "pdf2word.title": "PDF 转 Word",
      "pdf2word.subtitle": "将 PDF 中的文字提取为可编辑的 .docx 文件",
      "pdf2word.dropLabel": "上传要转换的 PDF",
      "pdf2word.action": "转换为 Word",
      "pdf2word.resultTitle": "已成功转换为 Word",
      "pdf2word.notice": "文字按页提取，复杂排版、分栏和图片不会被保留。",

      "word2pdf.title": "Word 转 PDF",
      "word2pdf.subtitle": "将 .docx 文档转换为 PDF",
      "word2pdf.dropLabel": "上传要转换的 .docx 文件",
      "word2pdf.action": "转换为 PDF",
      "word2pdf.resultTitle": "已成功转换为 PDF",
      "word2pdf.notice": "基本文字格式会被保留，复杂排版的显示效果可能有所不同。",

      "excel2pdf.title": "Excel 转 PDF",
      "excel2pdf.subtitle": "将每个工作表转换为一页 PDF",
      "excel2pdf.dropLabel": "上传要转换的电子表格",
      "excel2pdf.action": "转换为 PDF",
      "excel2pdf.resultTitle": "已成功转换为 PDF",
      "excel2pdf.notice": "每个工作表会以表格形式呈现，过宽的表格会自动缩放以适应页面。",

      "ppt2pdf.title": "PPT 转 PDF",
      "ppt2pdf.subtitle": "将幻灯片文字转换为 PDF，每页对应一张幻灯片",
      "ppt2pdf.dropLabel": "上传要转换的 .pptx 文件",
      "ppt2pdf.action": "转换为 PDF",
      "ppt2pdf.resultTitle": "已成功转换为 PDF",
      "ppt2pdf.notice": "此转换仅保留文字内容，原始幻灯片中的图片、切换效果和自定义版式不会被还原。",

      "footer.tagline": "完全在浏览器中运行的免费、私密 PDF 工具。",
      "footer.rights": "所有处理均在本地完成，文件不会离开你的设备。",
    },
  };

  const SUPPORTED = Object.keys(STRINGS);
  const DEFAULT_LANG = "en";

  function detectInitialLang() {
    const saved = localStorage.getItem("lll-lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("zh")) return "zh";
    return DEFAULT_LANG;
  }

  let currentLang = detectInitialLang();

  function t(key) {
    const dict = STRINGS[currentLang] || STRINGS[DEFAULT_LANG];
    return dict[key] ?? STRINGS[DEFAULT_LANG][key] ?? key;
  }

  function applyToDom(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });
    document.documentElement.setAttribute("lang", currentLang);
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem("lll-lang", lang);
    applyToDom(document);
    document.dispatchEvent(new CustomEvent("lll:langchange", { detail: { lang } }));
  }

  function getLang() {
    return currentLang;
  }

  window.i18n = { t, setLang, getLang, applyToDom, SUPPORTED };

  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("lang-select");
    if (select) {
      select.value = currentLang;
      select.addEventListener("change", (e) => setLang(e.target.value));
    }
    applyToDom(document);
  });
})();
