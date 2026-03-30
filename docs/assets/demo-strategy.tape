Output docs/assets/demo-strategy.gif
Set FontSize 16
Set Width 900
Set Height 500
Set Padding 30
Set Theme "Catppuccin Macchiato"
Set WindowBar Colorful

Require "./docs/assets/mock.sh"
Hide
Type "function docker() { ./docs/assets/mock.sh strategy; }"
Enter
Type "clear"
Enter
Show

Type "docker dso watch --strategy=auto"
Sleep 1s
Enter
Sleep 6s
