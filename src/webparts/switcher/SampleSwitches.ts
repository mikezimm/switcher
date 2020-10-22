
import { ISelectedSwitch } from './SwitcherWebPart';

export const Drill1 : ISelectedSwitch = {
    title: 'Drill1',
    sourceID: 'd1',
    sourceLoc: 'Drill1 Loc',
    type: 'drillProps',
    desc: 'Test View for Drill 1',
    order: 0,
    object: { title: 'Drill1', id: 'd1'},
    buttonImage: '',
    buttonColor: 'Auto',
    buttonIcon: 'Auto',
    buttonProps: '',
};

export const Drill2 : ISelectedSwitch = {
    title: 'Drill2',
    sourceID: 'd2',
    sourceLoc: 'Drill2 Loc',
    type: 'drillProps',
    desc: 'Test View for Drill 2',
    order: 0,
    object: { title: 'Drill2', id: 'd2'},
    buttonImage: '',
    buttonColor: 'Checkmark',
    buttonIcon: 'Checkmark',
    buttonProps: '',
};


export const sampleSwitches: ISelectedSwitch[] = [
    Drill1,
    Drill2
];