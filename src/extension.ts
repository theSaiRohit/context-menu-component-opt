import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("component-extn.newComponent", async (uri: vscode.Uri) => {
    const componentName = await vscode.window.showInputBox({
      placeHolder: "Enter Component Name"
    });
    if (!componentName) {
      vscode.window.showErrorMessage("Component Name is mandatory");
      return;
    }

    const selectedFolderPath = uri.fsPath;
    const componentPath = path.join(selectedFolderPath, componentName);
    await fs.mkdir(componentPath);

    const componentFiles = ["index.tsx", "styles.ts", "types.ts"];

    for (const file of componentFiles) {
      fs.writeFile(path.join(componentPath, file), "");
    }

    vscode.window.showInformationMessage(`Component '${componentName}' created successfully.`);
  });

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("setContext", "newComponentSupported", true);

  const executeHandler = (resource: any) => {
    vscode.commands.executeCommand("component-extn.newComponent", resource);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("component-extn.newComponentFromContextMenu", executeHandler)
  );
}

export function deactivate() {}
