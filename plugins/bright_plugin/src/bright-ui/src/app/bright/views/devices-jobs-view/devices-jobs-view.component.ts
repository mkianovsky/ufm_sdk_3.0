/**
 * @MODULES
 */
import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';

/**
 * @COMPONENTS
 * */
import {BehaviorSubject, Subscription} from "rxjs";
import {ActivatedRoute} from '@angular/router';

/**
 * @CONSTANTS
 */
import {DeviceJobsConstants} from "./constants/device-jobs.constants";
import {XCoreAgGridConstants} from "sms-ui-suite/x-core-ag-grid/constants/x-core-ag-grid.constants";
import {DevicesConstants} from "../../packages/devices/constants/devices.constants";

/**
 * @SERVICES
 */
import {XCoreAgGridOptions} from "sms-ui-suite/x-core-ag-grid/x-core-ag-grid-options/x-core-ag-grid-options";
import {BrightBackendService} from "../../packages/bright/services/bright-backend.service";
import {IXCoreAgGridExtraOptions} from "sms-ui-suite/x-core-ag-grid/x-core-ag-grid-options/x-core-ag-grid-extra-options.interface";
import {ContextMenuItem, DevicesJobsContextMenu} from "./classes/devices-jobs-context-menu";



@Component({
    selector: 'app-devices-jobs-view',
    templateUrl: './devices-jobs-view.component.html',
    styleUrls: ['./devices-jobs-view.component.scss']
})
export class DevicesJobsViewComponent implements OnInit {

  /**
   * @Inputs
   */
  @Input() selectedDevice;
  @Input() bright_ip: string;
  @Input() bright_port: string;

  /**
     * @VARIABLES
     * */
    private routeParamsSub:Subscription|undefined;
    public deviceFromRoute;
    public tableData;
    public tableOptions: XCoreAgGridOptions = new XCoreAgGridOptions();
    public contextMenuItems:[ContextMenuItem];
    public devicesJobsContextMenu:DevicesJobsContextMenu = new DevicesJobsContextMenu();

    /**
     * @CHILDREN
     */
    @ViewChild('statusTemp', {static: true}) statusTemp;
    @ViewChild("jobsStatisticsModal", {static: true}) jobsStatisticsModal;

    constructor(private backend:BrightBackendService,
                private activatedRoute:ActivatedRoute) {
    }

    get JOB_STATUS_MAP(){
        return DeviceJobsConstants.JOB_STATUS_MAP;
    }

    ngOnInit() {
        /*this.routeParamsSub = this.activatedRoute.parent?.params.subscribe((params)=> {
            if (params["id"] && params["id"] != "_") {
                this.deviceFromRoute = params["id"];
            } else {
                this.deviceFromRoute = undefined;
            }
            this.setTableOptions();
            this.loadData();
        });*/
        //this.loadData();
        this.contextMenuItems = this.devicesJobsContextMenu.buildContextMenu(this.onJobDetailsContextMenuClick);
    }

    ngOnDestroy() {
        if (this.routeParamsSub) {
            this.routeParamsSub.unsubscribe();

        }
    }

    public onJobDetailsContextMenuClick(row: any) {
      let jobType:string = row[DeviceJobsConstants.JOBS_SERVER_FIELDS.childType];
      jobType = jobType.charAt(0).toLowerCase() + jobType.slice(1)
      let uniqueKey = row[DeviceJobsConstants.JOBS_SERVER_FIELDS.uniqueKey];
      let url = 'https://'+ this.bright_ip + ':'+ this.bright_port + '/bright-view/#/j1/job/list/j2/' + jobType + '/' + uniqueKey + '/settings';
      window.open(url, "_blank");
    }

    public setTableOptions(): void {
        Object.assign(
            this.tableOptions.gridOptions,
            this.getJobsTableOptions()
        );
        Object.assign(
            this.tableOptions.extraOptions,
            this.getExtraTableOptions()
        );
    }

    public loadData(): void {
        this.tableData = undefined;
        /*this.backend.getDeviceJobs(this.selectedDevice[DevicesConstants.DEVICE_SERVER_KEYS.system_name]).subscribe(data => {
            this.tableData = data;
        })*/
    }

    /**
     * @desc this function prepare table option
     * @returns {{}}
     */
    private getJobsTableOptions() {
        return {
            [XCoreAgGridConstants.columnDefs]: [
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.childType,
                    [XCoreAgGridConstants.headerName]: 'Type',
                    [XCoreAgGridConstants.valueGetter]: (params: any) => {
                        return DeviceJobsConstants.JOB_TYPE_MAP[params.data[params.column.colId]] || params.data[params.column.colId];
                    }
                },
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.jobID,
                    [XCoreAgGridConstants.headerName]: 'Job ID'
                },
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.username,
                    [XCoreAgGridConstants.headerName]: 'User'
                },
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.inqueue,
                    [XCoreAgGridConstants.headerName]: 'Inqueue'
                },
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.starttime,
                    [XCoreAgGridConstants.headerName]: 'Running Time',
                    [XCoreAgGridConstants.valueGetter]: (params: any) => {
                        let duration = new Date(params.data[DeviceJobsConstants.JOBS_SERVER_FIELDS.endtime]).getTime()
                            - new Date(params.data[DeviceJobsConstants.JOBS_SERVER_FIELDS.starttime]).getTime();
                        return this.convertDurationToString(duration);
                    }
                },
                {
                    [XCoreAgGridConstants.field]: DeviceJobsConstants.JOBS_SERVER_FIELDS.status,
                    [XCoreAgGridConstants.headerName]: 'Status',
                    [XCoreAgGridConstants.cellRendererParams]: {
                        [XCoreAgGridConstants.ngTemplate]: this.statusTemp
                    }
                },
            ]
        }
    }

    /**
     * @desc this function called to prepare ag-grid extra option
     * @returns {{}}
     */
    private getExtraTableOptions():IXCoreAgGridExtraOptions {
        return {
            [XCoreAgGridConstants.selectRowByKey]: new BehaviorSubject<any>(false),
            [XCoreAgGridConstants.showContextMenu]: new EventEmitter<any>(false),
            [XCoreAgGridConstants.tableName]: "Device-Jobs",
            [XCoreAgGridConstants.exportToCSV]: true
        };
    }

    onContextMenuClick($event: any) {
      this.tableOptions.extraOptions[XCoreAgGridConstants.showContextMenu].emit($event);
    }

  /**
   * takes time duration and returns meaningful time string.
   * @param duration
   */
  private convertDurationToString(duration: number) {
    const portions: string[] = [];

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }

    return portions.join(' ');
  }


}