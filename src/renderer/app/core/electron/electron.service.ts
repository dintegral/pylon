import { Injectable, NgZone } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { IpcEventType, OpenTabIpcEvent } from '../../../ipc';
import { TabsStore } from '../store/tabs-store.service';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly ipcRenderer: typeof ipcRenderer;
  private readonly webFrame: typeof webFrame;
  private readonly childProcess: typeof childProcess;
  private readonly fs: typeof fs;

  constructor(
    private readonly ngZone: NgZone,
    private readonly tabsStore: TabsStore,
  ) {
    this.ipcRenderer = window.require('electron').ipcRenderer;
    this.webFrame = window.require('electron').webFrame;
    this.fs = window.require('fs');
    this.childProcess = window.require('child_process');
  }

  public initIpcEvents(): void {
    this.ipcRenderer.on(
      IpcEventType.openTab,
      (_event, payload: OpenTabIpcEvent) => {
        this.ngZone.run(() => {
          this.tabsStore.addTab({
            url: payload.url,
          });
        });
      },
    );
  }
}
