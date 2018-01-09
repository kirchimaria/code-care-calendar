import React,{Component} from 'react';
import {Link} from 'react-router-dom'
import { withStyles } from 'material-ui/styles';
import withRoot from '../../withRoot';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import {extrapolatedHoursFirstHalf , extrapolatedHoursSecondHalf} from '../../constants/actions';

 const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const ellipseText = (text, divided) => {
    const on = 31;

    if (text.length / Math.round(on / divided)  > 1)
        return text.slice(0 , Math.round(on / divided) - 3 ) + '...';

    return text;
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
      height: 540,
      width: 30,
  },
  calendarMarksSec: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      height: 480,
      width: 30,
  },
  calendarEvents: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      height: 540,
      width: 200,
      maxWidth: 200,
      position: 'relative',
      overflow: 'hidden',
  },
  eventRow: {
      display: 'flex',
      flexDirection: 'row',
    //   flexWrap: 'wrap',
      width: '100%',
      position: 'absolute',
  },
  eventBlock: {
      background: '#E2ECF5',
      boxSizing: 'border-box',
      borderLeft: '2px solid  #6E9ECF',
  },
  calendarContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: 520,
  },
  eventTitle: {
      fontSize: 14,
      fontFamily: 'Open Sans',
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

        let iArray = [ev];

        slicedEvents.slice(index + 1).forEach((item) => {
            if (ev.start + ev.duration >= item.start || iArray[iArray.length - 1].start + iArray[iArray.length - 1].duration > item.start)
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
        open: true,
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


    removeEvent = (id) => () => {
        this.props.removeEvent(id);
    }

    sendJson = (e) => {
        e.preventDefault();

        if (this.state.jsonFile) {
            this.props.uploadJson(this.state.jsonFile);
        }
    }

    handleClose = () => {
      this.setState({ open: false });
    };

    render() {
        const {classes} = this.props;
        const { value } = this.state;


        return (<div className={classes.root}>

            {this.props.alert && <Snackbar
              anchorOrigin={{vertical:  'bottom', horizontal:  'center' }}
              open={!!this.props.alert}
              onClick={this.props.clearAlert}
              SnackbarContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{this.props.alert.message}</span>}
            />}

        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Calendar" />
            <Tab label="Create Remove Events" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
            <div className={classes.calendarContainer}>
                <div className={classes.calendarRoot}>
                        <div className={classes.calendarMarks} >
                            {extrapolatedHoursFirstHalf.map((item , index) => (<div key={index}>
                                    <span style={{color: index % 2 == 0 ? '#639ecc' : '#c4c6c6' , fontSize: index % 2 == 0 ? 16 : 12 , fontFamily: 'Open Sans' }}>{item}</span>
                                </div>))}
                        </div>
                        <div className={classes.calendarEvents}>
                            {this.props.events && this.props.events.length > 0 && groupEventsByIntersection(this.props.events, 0 ,330).map((item , index) =>
                                (<div key={index} className={classes.eventRow} style={{top: item[0].start * 2}}>
                                    {item.map((i , ind) => (<div key={ind} className={classes.eventBlock} style={{flexGrow: 1 , height: Math.abs(i.start - (i.start + i.duration)) * 2,
                                        position: 'relative', top: ind === 0 ? 0 : Math.abs(i.start - item[0].start) * 2.4  }}>
                                            <span className={classes.eventTitle}>{ellipseText(i.title, item.length)}</span>
                                        </div>)) }
                                </div>))}
                        </div>
                </div>


                <div className={classes.calendarRoot}>
                        <div className={classes.calendarMarksSec}>
                            {extrapolatedHoursSecondHalf.map((item , index) => (<div key={index}>
                                    <span style={{color: index % 2 == 0 ? '#639ecc' : '#c4c6c6' , fontSize: index % 2 == 0 ? 16 : 12 , fontFamily: 'Open Sans' }}>{item}</span>
                                </div>))}
                        </div>
                        <div className={classes.calendarEvents}>
                            {this.props.events && this.props.events.length > 0 && groupEventsByIntersection(this.props.events, 330 ,1000).map((item , index) =>
                                (<div key={index} className={classes.eventRow} style={{top: (item[0].start * 2) - 540}}>
                                    {item.map((i , ind) => (<div key={ind} className={classes.eventBlock} style={{flexGrow: 1 , height: Math.abs(i.start - (i.start + i.duration)) * 2,
                                        position: 'relative', top: ind === 0 ? 0 : Math.abs( (i.start - 540) - (item[0].start - 540) ) * 2  }}>
                                            <span className={classes.eventTitle}>{ellipseText(i.title, item.length)}</span>
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
