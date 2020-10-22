import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

/**
 * DD Provider: Step 1 - import from sp-dynamic-data
 */
import { IDynamicDataCallables, IDynamicDataPropertyDefinition} from '@microsoft/sp-dynamic-data';

import * as strings from 'SwitcherWebPartStrings';
import Switcher from './components/Switcher';
import { ISwitcherProps } from './components/ISwitcherProps';
import { sampleSwitches } from './SampleSwitches';

import { findParentElementPropLikeThis } from '../../services/basicElements';

import { doesObjectExistInArray } from '../../services/arrayServices';

/**
 * DD Provider: Step 0 - add this.properties.switches to WebPartProps
 */
export interface ISwitcherWebPartProps {
  description: string;
  switches: ISelectedSwitch[];
}

/**
 * DD Provider: Step 0 - add Interface to define the selectedSwitch
 */
export type ISwitchType = 'pivotProps' | 'drillProps' | 'socialProps' | 'cssChartProps';
export const AllISwitchTypes = [ 'pivotProps' , 'drillProps' , 'socialProps' , 'cssChartProps' ];

export interface ISelectedSwitch {
  title: string;
  sourceID: string;
  sourceLoc: string;
  type: ISwitchType;
  desc: string;
  order: number;
  object: any;
  buttonImage?: string;
  buttonColor?: string;
  buttonIcon?: string;
  buttonProps?: any;
}

/**
 * DD Provider: Step 2 - add impliments IDynamicDataCallables
 */
export default class SwitcherWebPart extends BaseClientSideWebPart<ISwitcherWebPartProps> implements IDynamicDataCallables {

  /**
   * DD Provider: Step 6 - (9:51) add _selectedSwitch to be the placeholder for what was selected
   */
  private _selected_pivotProps : ISelectedSwitch;
  private _selected_drillProps : ISelectedSwitch;
  private _selected_socialProps : ISelectedSwitch;
  private _selected_cssChartProps : ISelectedSwitch;

  protected onInit(): Promise<void> {

    this.properties.switches = sampleSwitches;
    /**
     * DD Provider: Step 3 - add / update OnInit
     *  Tell DD Service that this is a provider
     */
    this.context.dynamicDataSourceManager.initializeSource(this);

    return Promise.resolve();

  }

  /**
   * DD Provider: Step 4 - (8:25) add getPropertyDefinitions
   * This tells SPFx what properties I can publish
   */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {

    return [
      {
        id: 'pivotProps',
        title: 'Selected Pivot Props'
      },
      {
        id: 'drillProps',
        title: 'Selected Drilldown Props',
      },
      {
        id: 'socialProps',
        title: 'Selected Socialiis Props',
      }
      ,
      {
        id: 'cssChartProps',
        title: 'Selected cssChart Props',
      }
    ];
  }

  /**
   * DD Provider: Step 5 - (8:43) add getPropertyValue
   * When something changes, SPFx needs to call the webpart and find out the updated property value
   *  This is defined on the interface
   * This takes in the name of the property that you want to return back.
   * string | any => any could be any interface if you want to use Interface
   */
  public getPropertyValue(propertyId: ISwitchType) : ISelectedSwitch {

    switch (propertyId) {
      case 'pivotProps':
        return this._selected_pivotProps;
      case 'drillProps':
        return this._selected_drillProps;
      case 'socialProps':
        return this._selected_socialProps;
      case 'cssChartProps':
        return this._selected_cssChartProps;
    }

      throw new Error('Bad property ID');
  }

  public render(): void {
    const element: React.ReactElement<ISwitcherProps > = React.createElement(
      Switcher,
      /**
       * DD Provider: Step 0 - add props to React Component to receive the switches and the handler.
       */
      {
        switches: this.properties.switches,
        handleSwitch: this.handleSwichSelected,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * DD Provider: Step 7 - (10:45) add handleSwichSelected - handler for when things changed.
   * 1) Set value of selected Switch on the internal property
   * 2) Tell anybody who subscribed, that property changed
   */
  private handleSwichSelected = ( thisSwitch ) : void => {

    let e = event;
    let thisID = findParentElementPropLikeThis(e.srcElement, 'id', 'ButtonID', 5, 'begins');
    console.log('thisID', thisID );
    thisID = thisID.replace('ButtonID','');

    let clickedIndex: any = doesObjectExistInArray( this.properties.switches, 'sourceID', thisID, true );
    let clickedSwitch = this.properties.switches[ clickedIndex ];
    console.log('clickedSwitch', clickedSwitch );

    //Set the selected switch
    this['_selected_' + clickedSwitch.type ] = clickedSwitch;

    //Clear all other switches if webpart dictates it
    AllISwitchTypes.map( sType => {
      if ( sType !== clickedSwitch.type ) { this['_selected_' + sType ] = null; }
    });

    this.context.dynamicDataSourceManager.notifyPropertyChanged( clickedSwitch.type );

  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
