# Doxygen 関数コメント自動生成拡張機能

C/C++ コード用の Doxygen スタイルの関数コメントテンプレートを自動生成する VSCode 拡張機能です。

## 機能

- **自動コメント生成**: 関数宣言から Doxygen スタイルのコメントを自動生成
- **タグサポート**: `@brief`、`@param`、`@retval` タグを含むコメントを作成
- **パラメータ抽出**: 関数のパラメータを自動で認識し、各パラメータ用に `@param` タグを生成
- **カスタマイズ可能**: コメントテンプレートを VSCode 設定で簡単にカスタマイズ可能
- **言語サポート**: C および C++ をサポート

## 必要環境

- **VSCode**: 1.85.0 以上
- **言語**: C, C++

## インストール

この拡張機能は VSCode マーケットプレイスから、またはローカルで以下の手順でビルドしてインストールできます：

```bash
npm install
npm run package
```

生成された `.vsix` ファイルを VSCode にドラッグ＆ドロップするか、`code --install-extension <path-to-vsix>` コマンドで直接インストールします。

## 使用方法

1. C または C++ ファイルを開きます
2. 関数宣言にカーソルを置きます
3. **Alt+E F** を押すか、コマンドパレットから「Generate Function Comment」を実行します
4. Doxygen スタイルのコメントが関数の上に自動挿入されます

### 例

```c
// カーソルがこの行にあるときに Alt+E F を押すと:
int add(int a, int b) {
    return a + b;
}

// 以下のようにコメントが挿入されます:
/// @brief
/// @param a
/// @param b
/// @retval
int add(int a, int b) {
    return a + b;
}
```

## 設定

VSCode の設定 (`settings.json`) で以下をカスタマイズできます：

```json
{
  "Function Comment.Template": [
    "/// @brief\t",
    "/// @param\t",
    "/// @retval\t"
  ],
  "Function Comment.Display Void": true
}
```

### オプション

- **`Function Comment.Template`** (配列): コメント行のテンプレート（デフォルト: Doxygen スタイル）
- **`Function Comment.Display Void`** (真偽値): void の戻り値を `@retval` に含めるか（デフォルト: `true`）

## 開発コマンド

```bash
# ウォッチモードでの開発ビルド
npm run watch

# 本番用ビルド (バンドル)
npm run package

# コンパイル (webpack)
npm run compile

# テストの実行 (テストランナーの監視が必要)
npm test

# テストの監視
npm run watch-tests

# コードのリンティング
npm run lint

# 公開前ビルド (package と lint を実行)
npm run vscode:prepublish

# CI環境でのテスト実行
npm run pretest
```

## アーキテクチャ

拡張機能は以下のモジュール構成を採用しています：

- **`src/extension.ts`**: エントリポイント。キーバインド登録とコマンド処理
- **`src/commands/comments.ts`**: コメント生成の全体オーケストレーション
- **`src/commands/declaration.ts`**: 関数宣言の検索と抽出
- **`src/commands/function.ts`**: 関数宣言の解析とパラメータ抽出
- **`src/commands/doxygen.ts`**: Doxygen コメント生成ロジック
- **`src/config/configration.ts`**: VSCode 設定の読み込み
- **`src/vscode_api.ts`**: VSCode API のラッパー

## テスト

テストは `@vscode/test-cli` と Mocha を使用します。テストファイルは `*.test.ts` の命名パターンに従います。

```bash
npm run watch-tests  # テストランナーを起動
npm test              # テストを実行
```

## ライセンス

詳細はプロジェクトのライセンスファイルを参照してください。
