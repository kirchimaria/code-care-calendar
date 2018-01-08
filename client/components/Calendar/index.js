import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import {extrapolatedHoursFirstHalf , extrapolatedHoursSecondHalf} from '../../constants/actions';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({

  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 3,
  },
  spreadRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  textField: {
      width: 300,
  },
  listItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      maxWidth: 800,
  },
  restrictedRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: 150,
      borderBottom: '1px solid #636261',
  },
  unlimetedRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderBottom: '1px solid #636261',
  },
  restrictedRowDelete: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: 30,
      borderBottom: '1px solid #636261',
  },
  input: {
      display: 'none',
  },
  button: {
      marginTop: 15,
  },
  sendButton: {
      marginTop: 15,
      marginLeft: 15,
  },
  calendarRoot: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: 240,
  },
  calendarMarks: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      height: 660,
      width: 30,
  },
  calendarEvents: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      height: 660,
      width: 200,
      maxWidth: 200,
      position: 'relative',
  },
  eventRow: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      position: 'absolute',
  },
  eventBlock: {
      background: '#E2ECF5',
      boxSizing: 'border-box',
      borderLeft: '2px solid  #6E9ECF',
  },
  calendarContainer: {

  }
});

const groupEventsByIntersection = (events , from ,to) => {
    let intersectionArray = [];

    let slicedEvents = events.filter((item) => {
        return item.start <= to && item.start >= from
    });

    slicedEvents.forEach((ev, index) => {
        if (index > 0) {
            let nextInstance = false

            intersectionArray[intersectionArray.length - 1].forEach((i , index) => {

                if (i.title==ev.title)
                    nextInstance = true;
            });

            if (nextInstance)
                return;
        }

        // if (index > 0 && intersectionArray[intersectionArray.length - 1][intersectionArray[intersectionArray.length - 1].length - 1].title == ev.title)
        //     return;

        let iArray = [ev];

        slicedEvents.slice(index + 1).forEach((item) => {
            if (ev.start + ev.duration >= item.start)
                iArray.push(item);
        });

        intersectionArray.push(iArray);
    });


    return intersectionArray;
}

const cutOn = (events ,on) => {
    return events.filter(item => item.start <= on && item.start + item.duration <= on);
}

class Calendar extends Component {
    state = {
        value: 0,
  };

    handleChange = (event, value) => {
    this.setState({ value });
    };

    handleChangeText = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    handleUploadFile = (event) => {
        this.setState({
            jsonFile: event.target.files[0],
        });
    }

    componentDidMount() {
        this.props.getEvents();
    }

    onCreate = () => {
        if (this.state.start && this.state.duration && this.state.title) {
            const eventObject = {
                title: this.state.title,
                duration: this.state.duration,
                start: this.state.start,
                userId: localStorage.getItem('userId'),
            }

            this.props.createEvent(eventObject);
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if ('events' in nextProps && nextProps.events.length > 0) {
    //         console.log(groupEventsByIntersection(nextProps.events, 0 , 330));
    //     }
    // }

    removeEvent = (id) => () => {
        this.props.removeEvent(id);
    }

    sendJson = (e) => {
        e.preventDefault();

        if (this.state.jsonFile) {
            this.props.uploadJson(this.state.jsonFile);
        }
    }

    render() {
        const {classes} = this.props;
        const { value } = this.state;


        return (<div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Calendar" />
            <Tab label="Create Remove Events" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
            <div className={classes.calendarContainer}>
                <div className={classes.calendarRoot}>
                        <div className={classes.calendarMarks}>
                            {extrapolatedHoursFirstHalf.map((item , index) => (<div key={index}>
                                    <span style={{color: index % 2 == 0 ? '#639ecc' : '#c4c6c6' , fontSize: index % 2 == 0 ? 14 : 11 }}>{item}</span>
                                </div>))}
                        </div>
                        <div className={classes.calendarEvents}>
                            {this.props.events && this.props.events.length > 0 && groupEventsByIntersection(this.props.events, 0 ,330).map((item , index) =>
                                (<div key={index} className={classes.eventRow} style={{top: item[0].start * 2.4}}>
                                    {item.map((i , ind) => (<div key={ind} className={classes.eventBlock} style={{flexGrow: 1 , height: Math.abs(i.start - (i.start + i.duration)) * 2,
                                        position: 'relative', top: ind === 0 ? 0 : Math.abs(i.start - item[0].start) * 2.4  }}>
                                            <span>{i.title}</span>
                                        </div>)) }
                                </div>))}
                        </div>
                </div>
            </div>

            </TabContainer>}
        {value === 1 && <TabContainer>
            <div className={classes.spreadRow}>
                <TextField
                    id="start"
                    placeholder="start"
                    className={classes.textField}
                    type="number"
                    value={this.state.start}
                    onChange={this.handleChangeText('start')}
                    margin="normal"
                  />

                <TextField
                    id="duration"
                    placeholder="duration"
                    className={classes.textField}
                    type="number"
                    value={this.state.duration}
                    onChange={this.handleChangeText('duration')}
                    margin="normal"
                  />

                  <TextField
                      id="title"
                      placeholder="title"
                      className={classes.textField}
                      type="email"
                      value={this.state.title}
                      onChange={this.handleChangeText('title')}
                      margin="normal"
                    />

                  <Button type='accent' onClick={this.onCreate}>
                    Create
                  </Button>
            </div>

            <div className={classes.spreadRow}>
                <form noValidate encType="multipart/form-data" onSubmit={this.sendJson}>
                    <input
                        accept='application/json'
                       className={classes.input}
                       onChange={this.handleUploadFile}
                       id="raised-button-file"
                       multiple
                       type="file"
                     />

                    <label htmlFor="raised-button-file">
                        <Button raised component="span" className={classes.button}>
                            Upload JSON
                        </Button>
                    </label>

                    <Button type='submit' type='accent' className={classes.sendButton}>
                        Send
                    </Button>

                </form>
            </div>

            {this.props.events && this.props.events.length >= 1 && <List>
                {this.props.events.map((item , index) => (<div  key={index} className={classes.listItem}><ListItem>
                    <ListItemText primary={`${item.start}`} className={classes.restrictedRow} />
                    <ListItemText primary={`${item.duration}`} className={classes.restrictedRow}/>
                    <ListItemText primary={`${item.title}`} className={classes.unlimetedRow}/>
                    <ListItemText primary={`X`} className={classes.restrictedRowDelete} onClick={this.removeEvent(item._id)}/>
                    </ListItem></div>))}
                </List>}
            </TabContainer>}
      </div>)
    }

}

export default withRoot(withStyles(styles)(Calendar));
