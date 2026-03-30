#!/bin/bash
if [ "$1" == "up" ]; then
    echo "DSO securely injecting secrets for docker-compose.yaml..."
    sleep 0.5
    echo "[+] up 3/3"
    echo -e " \033[32m✔\033[0m Network mysql_default        Created                                  0.1s"
    sleep 0.3
    echo -e " \033[32m✔\033[0m Container phpmyadmin_cnt     Started                                  0.8s"
    sleep 0.2
    echo -e " \033[32m✔\033[0m Container mysql_database_cnt Started                                  0.7s"

elif [ "$1" == "watch" ]; then
    echo -e "\033[1;36mDSO Watcher Active (Strategy: auto)\033[0m - Monitoring live container events..."
    echo "-----------------------------------------------------------------------------------"
    sleep 1.5
    echo -e "\033[1;33m[DSO ROTATION]\033[0m [10:02:30] Triggering re-injection for \033[1;32msecret://prod/db/password\033[0m"
    sleep 0.5
    echo -e "\033[1;36m[DSO EXECUTION]\033[0m"
    echo -e "Strategy: restart (compose)"
    echo -e "🔄 Native rotation: Scaling ./docker-compose.yaml from compose context."
    sleep 0.5
    echo -e "\033[1;33m[DSO ROTATION]\033[0m [10:02:30] Secret rotated: \033[1;32msecret://prod/db/password\033[0m"
    sleep 0.5
    echo -e "\033[1;36m[DSO WATCH]\033[0m [10:02:44] STOP → mysql_database_cnt"
    echo -e "\033[1;36m[DSO WATCH]\033[0m [10:02:45] DIE → mysql_database_cnt"
    echo -e "\033[1;36m[DSO WATCH]\033[0m [10:02:46] START → mysql_database_cnt"
    sleep 1.5

elif [ "$1" == "strategy" ]; then
    echo -e "\033[1;36m[DSO ANALYZER]\033[0m"
    echo -e "Container: mysql_database_cnt"
    echo -e "- Fixed Port: YES (3306)"
    echo -e "- Restart Policy: ALWAYS"
    echo -e "- Stateful: YES"
    echo -e "- Health Check: NO"
    echo ""
    sleep 0.5
    echo -e "\033[1;36m[DSO STRATEGY]\033[0m"
    echo -e "Selected: restart"
    echo -e "Score: 40"
    echo -e "Reason:"
    echo -e "- Fixed port binding prevents parallel containers"
    echo -e "- Stateful workload detected (risk of data corruption during parallel run)"
    echo ""
    sleep 1
    echo -e "\033[1;32m[DSO ROTATION]\033[0m No change detected → skipping"
    sleep 1.5
fi
