import * as React from 'react';
import styles from './Switcher.module.scss';
import { ISwitcherProps } from './ISwitcherProps';
import { escape } from '@microsoft/sp-lodash-subset';


export default class Switcher extends React.Component<ISwitcherProps, {}> {

  public render(): React.ReactElement<ISwitcherProps> {

    let elements : any[] = this.props.switches.map( thisSwitch => {
      return  <div  id={ 'ButtonID' + thisSwitch.sourceID } 
                    title={thisSwitch.title} 
                    style={{ padding: 20 }}>
                      <div onClick={ this.props.handleSwitch.bind(this) } >
                          { thisSwitch.title }</div><div>{ thisSwitch.desc }</div>
              </div>; 
    });  //END Elements array

    return (
      <div className={ styles.switcher }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            { elements }
          </div>
        </div>
      </div>
    );
  }
}
