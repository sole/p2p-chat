# p2p-chat

This is a **certified** app demonstrating how to build a p2p chat app using wifi direct in Firefox OS.

I'm actually using it to learn about this technology sooooo don't take anything too seriously, will you? :-)

## Usage

Import the app into the [WebIDE](https://developer.mozilla.org/docs/Tools/WebIDE). Then you can run it on a Firefox OS device. It won't work on a simulator I'm afraid: something about host devices not supporting wifi direct, yadda yadda.

Your device needs to be a) rooted and b) have wifi direct enabled.

Flame devices are generally rooted.

To enable wifi direct run this script:

```bash
#!/bin/sh
adb remount
adb shell "stop b2g"
adb shell "echo \"ro.moz.wifi.p2p_supported=1\" >> /system/build.prop"
adb reboot
```

