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

interface Props {
    userName: string;
}

export class Home extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.onSelectDropdownMonth = this.onSelectDropdownMonth.bind(this);
        this.onSelectDropdownYear = this.onSelectDropdownYear.bind(this);
        this.onSelectDropdownEntryOccassion= this.onSelectDropdownEntryOccassion.bind(this);
        this.onSelectDropdownEntryTime= this.onSelectDropdownEntryTime.bind(this);
        this.handleEntrySubmit= this.handleEntrySubmit.bind(this);
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
        createEntryDetails: {}
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
        this.setState({ entryDetails: "", entryStatus: false });
        //console.log("questionSet",this.state.mainCompleteQuestions);
        let userObj: any = this.state.mainCompleteQuestions.filter((i: any) => { return i.username.toLowerCase() == this.state.loggedUsername.toLowerCase() })
        console.log("questionSet", userObj);
        if (userObj) {
            userObj[0].calendarinvite.map((i: any) => {
                if (i.dateObj.date == d) {
                    if (i.dateObj.month.toLowerCase() == month.toLowerCase()) {
                        if (i.dateObj.year == year) {
                            //alert("there is a entry")
                            this.setState({ entryStatus: true });
                            let entryDetails = this.state.entryDetails;
                            entryDetails += i.occassion + "   " + i.timeStamp;
                            this.setState({ entryDetails: entryDetails });
                            return true;
                        }
                    }
                }
            })
        }
    }
    //on day click
    onDayClick = (e: any, d: any) => {
        console.log("click date details", e, d, this.month(), this.year());
        this.setState({ selectedDate: d + " " + this.month() + " " + this.year() });
        this.checkEntry(d, this.month(), this.year());
    }

    //Create a new entry
    createEntry = (e:any) => {
        this.setState({ createEntryStatus: true });
    }
    //on select dropdown for entry occassion
    onSelectDropdownEntryOccassion=(e:any)=>{
        console.log(e);
    }
    onSelectDropdownEntryTime=(e:any)=>{
        console.log(e)
    }
    //code for on entry 
    handleEntrySubmit=(e:any)=>{
        console.log(e);
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
        //Popop
        const popover = (
            <Popover id="popover-basic">
                <Popover.Title as="h3">{this.state.selectedDate}</Popover.Title>
                {
                    this.state.entryStatus ?
                        <Popover.Content>
                            {this.state.entryDetails}
                        </Popover.Content> :
                        <Popover.Content>
                            OOPS! You don't have any entry.
                        <Button className="success" onClick={(e) => this.createEntry(e)}>Create a Entry!</Button>
                            <Form onSubmit={this.handleEntrySubmit} style={{ border: "1px solid #999", borderRadius: '15px', padding: '1rem', margin: '1rem', textAlign: 'left' }}>
                                <h3>Fill the Required Details</h3>
                                <hr />
                                <Form.Group controlId="formBasicEmail">
                                    <DropdownButton title="Select Occassion" onSelect={(e) => { this.onSelectDropdownEntryOccassion(e) }}>
                                        <this.SelectList data={this.months} />
                                    </DropdownButton>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <DropdownButton title="Select TimeSlot" onSelect={(e) => { this.onSelectDropdownEntryTime(e) }}>
                                        <this.SelectList data={this.months} />
                                    </DropdownButton>
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Save
                                </Button>
                            </Form>
                        </Popover.Content>

                }

            </Popover>
        );
        // code for getting all the date details for a month
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == parseInt(this.currentDay()) ? "day current-day" : 'day');
            daysInMonth.push(<td key={d} className={className} onClick={(e) => this.onDayClick(e, d)}>
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                    <span>{d}</span>
                </OverlayTrigger>
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