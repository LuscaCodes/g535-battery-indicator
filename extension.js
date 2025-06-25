const {St, GLib, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

let panelButton, panelButtonText, icon, timeout;

function setButtonText () {
  var arr = [];
  
  var str = GLib.spawn_command_line_sync('headsetcontrol -b');
  var strOutput = ' ' + str.toString().replace('\n', '').split(': ')[1].split('Success')[0].replace('\n', '');
  icon.set_icon_name('audio-headphones-symbolic');

  if (strOutput.includes('Unavailable') || strOutput.includes('0%')) {
    strOutput = '';
    icon.set_icon_name('');
  }

  arr.push('' + strOutput);

  panelButtonText.set_text(arr.join('    '));

  return true;
}

function init () {
  panelButton = new St.Bin({
    style_class : "panel-button"
  });
  panelButtonText = new St.Label({
    style_class : "headset-indicator",
    text : "",
    y_align: Clutter.ActorAlign.CENTER,

  });

  panelButton.set_child(panelButtonText);

  icon = new St.Icon({
    icon_name: "audio-headphones-symbolic",
    icon_size: 16,
  });

}

function enable () {
  Main.panel._centerBox.insert_child_at_index(icon, 0);
  Main.panel._centerBox.insert_child_at_index(panelButton, 1);
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable () {
  Mainloop.source_remove(timeout);
  Main.panel._centerBox.remove_child(panelButton);
}
