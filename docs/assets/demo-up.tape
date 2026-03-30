Output docs/assets/demo-up.gif
Set FontSize 18
Set Width 900
Set Height 400
Set Padding 30
Set Theme "Catppuccin Macchiato"
Set WindowBar Colorful

Require "./docs/assets/mock.sh"
Hide
Type "function docker() { ./docs/assets/mock.sh up; }"
Enter
Type "clear"
Enter
Show

Type "docker dso up -d"
Sleep 1s
Enter
Sleep 3s
