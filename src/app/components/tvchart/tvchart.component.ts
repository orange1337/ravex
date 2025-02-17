import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    widget,
    IChartingLibraryWidget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
} from '../../../assets/libs/charting_library/charting_library/charting_library.min';
import { MainService } from '../../services/main.service';

@Component({
    selector: 'app-tv-chart-container',
    template: `<div class="app-tv-chart-container" id="tv_chart_container"></div>`
})
export class TvChartContainerComponent implements OnInit, OnDestroy {

    constructor(public mainService: MainService){}

    private _symbol: ChartingLibraryWidgetOptions['symbol'] = this.mainService.symbol;
    private _interval: ChartingLibraryWidgetOptions['interval'] = 'H';
    // BEWARE: no trailing slash is expected in feed URL
    private _datafeedUrl = '/tv'; //'https://demo_feed.tradingview.com';
    private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/libs/charting_library/charting_library/';
    private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = '/'; //'https://saveload.tradingview.com';
    private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
    private _theme: ChartingLibraryWidgetOptions['theme'] = 'Dark';
    private _tvWidget: IChartingLibraryWidget | null = null;

    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        this._symbol = symbol || this._symbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this._interval = interval || this._interval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this._datafeedUrl = datafeedUrl || this._datafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this._libraryPath = libraryPath || this._libraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this._clientId = clientId || this._clientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this._userId = userId || this._userId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this._fullscreen = fullscreen || this._fullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this._autosize = autosize || this._autosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this._containerId = containerId || this._containerId;
    }

    @Input()
    set theme(containerId: ChartingLibraryWidgetOptions['theme']) {
        this._theme = containerId || this._theme;
    }

    ngOnInit() {
        function getLanguageFromURL(): LanguageCode | null {
            const regex = new RegExp('[\\?&]lang=([^&#]*)');
            const results = regex.exec(location.search);

            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
        }

        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: this._symbol,
            datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
            interval: this._interval,
            container_id: this._containerId,
            library_path: this._libraryPath,
            locale: getLanguageFromURL() || 'en',
            disabled_features: [
                "use_localstorage_for_settings", 
                "header_symbol_search", 
                "symbol_search_hot_key", 
                "left_toolbar",
                "header_settings",
                "header_compare",
                "header_saveload",
                "header_screenshot",
                "header_compare",
                "header_undo_redo",
                "control_bar",
                "display_market_status",
                "create_volume_indicator_by_default",
                "timeframes_toolbar"
            ],
            charts_storage_url: this._chartsStorageUrl,
            charts_storage_api_version: this._chartsStorageApiVersion,
            client_id: this._clientId,
            user_id: this._userId,
            fullscreen: this._fullscreen,
            autosize: this._autosize,
            theme: this._theme,
            overrides: { "paneProperties.background": "#1a2748" },
            toolbar_bg: "#17213f",
        };

        const tvWidget: any = new widget(widgetOptions);
        this._tvWidget = tvWidget;

        tvWidget.onChartReady(() => {
            tvWidget.addCustomCSSFile('/assets/libs/tv-custom.css');
            /*const button = tvWidget.createButton()
                .attr('title', 'Click to show a notification popup')
                .addClass('apply-common-tooltip')
                .on('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                        console.log('Noticed!');
                    },
                }));

            button[0].innerHTML = 'Check API';*/
        });
    }

    ngOnDestroy() {
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
    }
}