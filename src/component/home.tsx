import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import './../stylescss/calendar.css';
import { AnyARecord } from "dns";
import { isThisTypeNode } from "typescript";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import questionSet from './../DB/question';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
interface Props {
    userName: string;
}

export class Home extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.onSelectDropdownMonth = this.onSelectDropdownMonth.bind(this);
        this.onSelectDropdownYear = this.onSelectDropdownYear.bind(this);
        this.onSelectDropdownEntryOccassion = this.onSelectDropdownEntryOccassion.bind(this);
        this.onSelectDropdownEntryTime = this.onSelectDropdownEntryTime.bind(this);
        this.handleEntrySubmit = this.handleEntrySubmit.bind(this);
    }

    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDate: '',
        mainCompleteQuestions: [],
        loggedUsername: '',
        entryStatus: false,
        entryDetails: '',
        createEntryStatus: false,
        createEntryDetails: {},
        isEntryExist:false,
        selectedEntryOccasion:'',
        selectedEntryTime:''
    }
    componentDidMount() {
        this.setState({ mainCompleteQuestions: questionSet.questionSet });
        let username = localStorage.getItem('username');
        this.setState({ loggedUsername: username });
    }

    weekdays = moment.weekdays();//['sunday,'monday,'tuesday'.....]
    weekdaysShort = moment.weekdaysShort(); //['Sun','Mon','tues'......]
    months = moment.months();
    year = () => {
        return this.state.dateContext.format('Y');
    }
    month = () => {
        return this.state.dateContext.format('MMMM');
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        return this.state.dateContext.get('date');
    }
    currentDay = () => {
        return this.state.dateContext.format('D');
    }
    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');// days between 0,1, ....6
        return firstDay;
    }
    // select dropdown list for month
    SelectList = (props: any) => {
        let popup = props.data.map((data: any, i: any) => {
            return (
                <Dropdown.Item eventKey={data} key={i}>{data}</Dropdown.Item>
            )
        })
        return (
            <div>
                {popup}
            </div>
        )
    }

    //select dropdown list for year
    SelectListYear = (props: any) => {
        let popup: any = [];
        let year = new Date().getFullYear();
        for (let i = year; i > year - 10; i--) {
            popup.push(<Dropdown.Item eventKey={i.toString()} key={i * 10}>{i}</Dropdown.Item>);
        }
        console.log(popup);
        return (
            <div>
                {popup}
            </div>
        )
    }

    //Code for set month on Dropdown change
    setMonth = (month: any) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext)
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({ dateContext: dateContext });
    }
    //Code for set Year on Dropdown change
    setYear = (year: any) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }
    //on month dropdown select
    onSelectDropdownMonth(event: any) {
        console.log(event);
        this.setMonth(event);
        this.props.onMonthChange && this.props.onMonthChange();
    }
    //on year dropdown select
    onSelectDropdownYear(event: any) {
        console.log(event);
        this.setYear(event);
        this.props.onYearChange && this.props.onYearChange();
    }
    //code for month nav
    MonthNav = () => {
        return (
            <span>
                <DropdownButton title="Month" onSelect={(e) => { this.onSelectDropdownMonth(e) }}>
                    <this.SelectList data={this.months} />
                </DropdownButton>
            </span>
        )
    }
    //code for year nav
    YearNav = () => {
        return (
            <span>
                <DropdownButton title="Year" onSelect={(e) => { this.onSelectDropdownYear(e) }}>
                    <this.SelectListYear data={this.year()} />
                </DropdownButton>
            </span>
        )
    }
    //code for next month 
    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, 'month');
        this.setState({ dateContext: dateContext });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    //code for prev month 
    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, 'month');
        this.setState({ dateContext: dateContext });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }
    //function to check the entry
    checkEntry(d: any, month: any, year: any) {
        this.setState({ entryDetails: "", isEntryExist:false, selectedEntryOccasion:'', selectedEntryTime:'' });

        //console.log("questionSet",this.state.mainCompleteQuestions);
        let userObj: any = this.state.mainCompleteQuestions.filter((i: any) => { return i.username == this.state.loggedUsername })
        // let tempObj= [];
        // tempObj.push(userObj);
        // this.setState({mainCompleteQuestions:tempObj});
        if(this.state.mainCompleteQuestions .length ==1){
            userObj=this.state.mainCompleteQuestions;
        }
        console.log("questionSet", userObj);
        if (userObj.length>0) {
            userObj[0].calendarinvite.map((i: any) => {
                console.log(i.dateObj.date,i.dateObj.month.toLowerCase(), i.dateObj.year.toString(), d, month.toLowerCase(), year );
                if (i.dateObj.date == d && i.dateObj.month.toLowerCase() == month.toLowerCase() && i.dateObj.year.toString() == year) {
                    //alert("there is a entry");
                    this.setState({entryDetails:""});
                    this.setState({ entryStatus: true,isEntryExist:true});
                    let entryDetails = this.state.entryDetails;
                    entryDetails = i.occassion + "   " + i.timeStamp;
                    this.setState({ entryDetails: entryDetails });
                    console.log(this.state.entryStatus, this.state.isEntryExist, this.state.entryDetails, entryDetails);
                    return true;
                }
                // else{
                //     console.log("else",this.state.entryStatus, this.state.isEntryExist, this.state.entryDetails);
                //     //this.setState({isEntryExist:false})
                // }
                    
            })
        }
    }
    //Modal called function on date click
    // showModalComp = (e: any) => {
    //     console.log("eeeeeeeeeeeeeeeeeee",e);
    //     return(
    //         <this.Popover />
    //     )
    // }
    //Show modal for entry
    ModalPop = (props: any) => {
        return (
            <Modal show={this.state.entryStatus} onHide={() => this.setState({entryStatus:false})} dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                <Modal.Title>{this.state.selectedDate}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.state.isEntryExist ?
                            <h4>Your Entries: <h5>{this.state.entryDetails}</h5></h4>
                            :
                            <div>
                                <h4>OOPS! You don't have any entry.</h4>
                                <Button className="success" onClick={() => this.setState({ createEntryStatus: !this.state.createEntryStatus })}>Create a Entry!</Button>
                            </div>
                    }
                    {
                        this.state.createEntryStatus?
                        <Form style={{ border: "1px solid #999", borderRadius: '15px', padding: '1rem', margin: '1rem', textAlign: 'left' }}>
                        <h3>Fill the Required Details</h3>
                        <hr />
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formBasicEmail">
                                        <DropdownButton title="Select Occassion" onSelect={(e) => { this.onSelectDropdownEntryOccassion(e) }}>
                                            <Dropdown.Item eventKey={'Birthday'}>BirthDay</Dropdown.Item>
                                            <Dropdown.Item eventKey={'Meeting'}>Meeting</Dropdown.Item>
                                            <Dropdown.Item eventKey={'Party'}>Party</Dropdown.Item>
                                            <Dropdown.Item eventKey={'Trip'}>Trip</Dropdown.Item>
                                        </DropdownButton>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formBasicPassword">
                                        <DropdownButton title="Select TimeSlot" onSelect={(e) => { this.onSelectDropdownEntryTime(e) }}>
                                            <Dropdown.Item eventKey={'3:00am-4:00am'}>3:00am-4:00am</Dropdown.Item>
                                            <Dropdown.Item eventKey={'6:00am-7:00am'}>6:00am-7:00am</Dropdown.Item>
                                            <Dropdown.Item eventKey={'2:00am-4:00am'}>2:00am-4:00am</Dropdown.Item>
                                            <Dropdown.Item eventKey={'1:00am-6:00am'}>1:00am-6:00am</Dropdown.Item>
                                        </DropdownButton>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                        <Button variant="primary" type="submit" onClick={this.handleEntrySubmit}>
                            Save
                        </Button>
                    </Form>:
                    null
                }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    //on day click
    onDayClick = (e: any, d: any) => {
        //this.setState({ entryStatus: false });
        //console.log("click date details", e, d, this.month(), this.year());
        this.setState({ selectedDate: d + " " + this.month() + " " + this.year() });
        this.checkEntry(d, this.month(), this.year());
        this.setState({ entryStatus: true });
        //this.showModalComp(e);
    }
    //on select dropdown for entry occassion
    onSelectDropdownEntryOccassion = (e: any) => {
        console.log(e);
        this.setState({selectedEntryOccasion:e});

    }
    onSelectDropdownEntryTime = (e: any) => {
        console.log(e);
        this.setState({selectedEntryTime:e});
    }
    //code for on entry 
    handleEntrySubmit = (e: any) => {
        console.log(this.state.entryDetails);
        let entry= this.state.selectedEntryOccasion+" "+ this.state.selectedEntryTime;
        console.log(entry);
        let Obj={
            dateObj: {
                date: this.state.selectedDate.split(' ')[0], 
                month: this.month(), 
                year: this.year()
            },
            occassion: this.state.selectedEntryOccasion,
            timeStamp: this.state.selectedEntryTime
        }
        let tempArray:any=[];
        tempArray.push(this.state.mainCompleteQuestions[0]) ;
        tempArray[0].calendarinvite.push(Obj);
        this.setState({mainCompleteQuestions: tempArray, createEntryStatus:false});
        setTimeout(() => {
            console.log(" the main data for saving is ", this.state.mainCompleteQuestions);
            alert("Entry saved! ")
        }, 100);
    }
    render() {
        // Mapping done for displaying the weekdays as Sun, mon, tues
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <th key={day} style={{ width: '10%', background: '#f37979', color: '#fff' }}>{day}</th>
            )
        })
        // code for showing the blank date
        let blanks = [];
        for (let i = 0; i < parseInt(this.firstDayOfMonth()); i++) {
            blanks.push(<td key={i * 10} className="blankDay">{''}</td>)
        }
        //console.log('blanks', blanks);
        // code for getting all the date details for a month
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == parseInt(this.currentDay()) ? "day current-day" : 'day');
            daysInMonth.push(<td key={d} className={className} onClick={(e) => this.onDayClick(e, d)}>
                <span>{d}</span>
            </td>
            )
        }
        //console.log("days  :", daysInMonth );

        //code for concatting the blank and days in month 
        var totalSlots = [...blanks, ...daysInMonth];
        let rows: any = [];
        let cells: any = [];
        totalSlots.map((row, i) => {
            if ((i % 7) != 0) {
                cells.push(row);
            }
            else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i == totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        })

        //final date for rendering
        let trElems: any = rows.map((d: any, i: any) => {
            return (
                <tr key={i * 10}>
                    {d}
                </tr>
            );
        })
        //console.log('trElems', trElems);

        return (

            <div>
                {
                    this.state.entryStatus?<this.ModalPop />:null
                }
                
                <br />
                <Container>
                    <Row>
                        <Col xs="8" lg="12">
                            <br />
                            <h4 className="alignLeft">Welcome to GCalendar </h4>
                            <hr />
                            <br />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col lg="5">
                            <Row>
                                <Col><this.MonthNav /></Col>
                                <Col><p className="nextprev month">{this.month()}</p></Col>
                                <Col></Col>
                                <Col><this.YearNav /></Col>
                                <Col><p className="nextprev month">{this.year()}</p></Col>
                            </Row>
                        </Col>
                        <Col lg="5"></Col>
                        <Col lg="1" onClick={() => this.prevMonth()} className="nextprev"> &lt; Prev </Col>
                        <Col lg="1" onClick={() => this.nextMonth()} className="nextprev">Next &gt;</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col xs="8" lg="12">
                            <Table striped bordered hover style={{ textAlign: "center" }}>
                                <thead>
                                    <tr>
                                        {weekdays}
                                    </tr>
                                </thead>
                                <tbody>
                                    {trElems}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}