import * as vscode from 'vscode';
import { workspace } from 'vscode';


let defaultIconTheme: string | undefined;



export function getDefaltIconTheme() {
    let confDefaultIconTheme = workspace.getConfiguration().get<string>('mc-dp-icons.setDefaultIconTheme');
    if (confDefaultIconTheme === "") {
      let gettingDefaultIconTheme = vscode.workspace.getConfiguration('workbench').get<string>('iconTheme');
      if (gettingDefaultIconTheme !== "mc-dp-icons") {
        defaultIconTheme = gettingDefaultIconTheme;
      }
    } else {
      defaultIconTheme = confDefaultIconTheme;
    }
    console.log('default icon theme is ' + defaultIconTheme);
    vscode.window.showInformationMessage('default icon theme is ' + defaultIconTheme);
  }
  
export function checkPackMcmeta() {
    const enableCheck = workspace.getConfiguration().get<boolean>('mc-dp-icons.enablePackMcmetaCheck');
    if (enableCheck) {

  // Find the pack.mcmeta file in the workspace
  vscode.workspace
    .findFiles('**/pack.mcmeta', '**/node_modules/**')
    .then((files) => {
      if (files.length > 0) {
        console.log('pack.mcmeta is found');
        // Set the icon theme to the Datapack Icons theme
        vscode.workspace
            .getConfiguration('workbench')
        .update('iconTheme', 'mc-dp-icons', vscode.ConfigurationTarget.Workspace);
    } else {
            console.log('pack.mcmeta is not found');
            // Reset the icon theme to the default one
            if (defaultIconTheme) {
              vscode.workspace
                .getConfiguration('workbench')
                .update('iconTheme', defaultIconTheme, vscode.ConfigurationTarget.Workspace);
                console.log('changing to default, which is ' + defaultIconTheme);
                console.log('now its ' + vscode.workspace.getConfiguration('workbench').get<string>('iconTheme'));
            }
          }
        });
    }
}
  
  