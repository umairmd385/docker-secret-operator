Output docs/assets/demo-rotation.gif
Set FontSize 16
Set Width 1000
Set Height 450
Set Padding 30
Set Theme "Catppuccin Macchiato"
Set WindowBar Colorful

Require "./docs/assets/mock.sh"
Hide
Type "function docker() { ./docs/assets/mock.sh watch; }"
Enter
Type "clear"
Enter
Show

Type "docker dso watch --strategy=auto"
Sleep 1s
Enter
Sleep 6s
