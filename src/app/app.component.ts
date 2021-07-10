import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "task-manager";
  totalServers = 1;
  servers = [{ waiting: [], showProgress: false, timer: null }];
  pendingTask = 0;
  newTask;
  isRemoveServer = false;

  addtask() {
    if (this.newTask > 0) {
      this.pendingTask += this.newTask;
      this.newTask = null;
      this.redistributeTask();
    }
  }

  redistributeTask() {
    const taskPerServer = Math.floor(this.pendingTask / this.totalServers);
    const extraTasks = this.pendingTask % this.totalServers;
    if (taskPerServer + extraTasks) {
      for (let i = 0; i < extraTasks; i++) {
        this.servers[i].waiting = Array(taskPerServer + 1).fill(0);
        this.startTask(i);
      }
      if (taskPerServer) {
        for (let i = extraTasks; i < this.totalServers; i++) {
          this.servers[i].waiting = Array(taskPerServer).fill(0);
          this.startTask(i);
        }
      }
    }
  }

  startTask(index) {
    if (!this.servers[index].timer) {
      this.servers[index].showProgress = true;
      this.servers[index].waiting.pop();
      this.pendingTask--;

      clearInterval(this.servers[index].timer);
      this.servers[index].timer = setInterval(() => {
        if (this.isRemoveServer) {
          this.servers.forEach((server) => {
            clearInterval(server.timer);
            server.timer = null;
          });
          this.servers.splice(index, 1);
          this.totalServers--;
          this.isRemoveServer = false;
          this.servers[index].showProgress = false;
          this.redistributeTask();
          return;
        }
        if (this.servers[index].waiting.length) {
          this.servers[index].waiting.pop();
          this.pendingTask--;
        } else {
          this.servers[index].showProgress = false;
          clearInterval(this.servers[index].timer);
          this.servers[index].timer = null;
        }
      }, 20000);
    }
  }

  addServer() {
    if (this.totalServers < 10) {
      this.servers.push({
        waiting: [],
        showProgress: false,
        timer: null,
      });
      this.totalServers++;
      this.redistributeTask();
    }
  }

  removeServer() {
    console.log(this.servers);
    for (let i = 0; i < this.totalServers; i++) {
      if (!this.servers[i].timer) {
        this.servers.splice(i, 1);
        this.totalServers--;
        return;
      }
    }
    this.isRemoveServer = true;
  }
  removeTask(){
    this.pendingTask--;
    this.redistributeTask();
  }
}
