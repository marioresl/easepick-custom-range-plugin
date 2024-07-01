import { BasePlugin, IEventDetail, IPlugin } from '@easepick/base-plugin';
import { DateTime } from '@easepick/datetime';
import { ISamplePlugin } from './interface';
import './index.scss';
import {RangePlugin} from "@easepick/range-plugin";
export class SamplePlugin extends BasePlugin implements IPlugin {

  public binds = {
    onView: this.onView.bind(this),
    getEndDate: this.getEndDate.bind(this),
    setEndDate: this.setEndDate.bind(this),
  }

  public options: ISamplePlugin = {
    fgColor: '#fff',
    bgColor: '#000',
  };

  public rangePlugin: RangePlugin;

  /**
   * Returns plugin name
   * 
   * @returns String
   */
  public getName(): string {
    return 'SamplePlugin';
  }

  /**
   * - Called automatically via BasePlugin.attach() -
   * The function execute on initialize the picker
   */
  public onAttach(): void {
    // @ts-ignore
    this.binds['__getEndDate'] = this.picker.getEndDate;
    // @ts-ignore
    this.binds['__setEndDate'] = this.picker.setEndDate;
    Object.defineProperties(this.picker, {
      getEndDate: {
        configurable: true,
        value: this.binds.getEndDate,
      },
      setEndDate: {
          configurable: true,
          value: this.binds.setEndDate,
      }
    })

    this.rangePlugin = this.picker.PluginManager.getInstance('RangePlugin');

    this.picker.on('view', this.binds.onView);
  }

  /**
   * - Called automatically via BasePlugin.detach() -
   */
  public onDetach(): void {
    this.picker.off('view', this.binds.onView);
  }

  /**
   * Function `view` event
   * Changes `backgroundColor` and `color` of today
   * 
   * @param event 
   */
  private onView(event: CustomEvent) {
    const { view, date, target }: IEventDetail = event.detail;
    const today = (new Date()).toISOString().substring(0, 10);
    
    if (view === 'CalendarDay' && today === date.format('YYYY-MM-DD')) {
      target.style.backgroundColor = this.options.bgColor;
      target.style.color = this.options.fgColor;
    }
  }

  private getEndDate() {
    return this.binds['__getEndDate']() ?? new DateTime(new Date(3000, 0, 1));
  }

  private setEndDate(date: Date | string | number | null) {
    console.log(this.picker.datePicked);
    if (date === null) {
      this.rangePlugin.options.endDate = null;
      this.picker.updateValues();
      this.picker.renderAll();
    }
    else return this.binds['__setEndDate'](date);
  }
}