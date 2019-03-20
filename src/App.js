import React, { Component } from 'react';
import CSVReader from "react-csv-reader";
import parse from 'html-react-parser';

var books = require('google-books-search');

class App extends Component {
  constructor() {
    super();
    this.state = {
      csvData: [
        ["Company Name","1/1/2019","1/2/2019","1/3/2019","1/4/2019","1/5/2019","1/6/2019","1/7/2019"],
        ["c2","500","600","700","800","901","1001","999"],
        ["c1","404","506","634","456","787","235","433"],
        ["c3","1001","1231","1341","999","823","787","1321"],
        ["c4","781","888","567","982","687","452","154"],
        ["c5","143","342","143","451","871","341","485"],
        ["c6","241","253","560","141","673","351","361"],
        ["c7","897","971","691","813","991","941","934"],
        []
      ],
      default: true,
      titleInput: '',
      googleBooksData: []
    };  
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
  }

  sortColumnAction = (column_key) => {
    var sortedArray = this.state.csvData;
    var i = 0;
    sortedArray.sort((a,b) => {
      if(a[column_key] && b[column_key])
      {
        // Ignore Row Header for Sorting
        if(a[column_key] === sortedArray[0][column_key] || b[column_key] === sortedArray[0][column_key])
          return '';
        return a[column_key].localeCompare(b[column_key], undefined, {numeric: true, sensitivity: 'base'});
      }
    });
    this.setState({
      csvData: sortedArray
    });

  
  }

  sortColumns = () => {
    //alert(this.state.csvData[0]);
    return this.state.csvData[0].map((value, key) => {
      return <span><button onClick={()=>this.sortColumnAction(key)}>{value}</button>&nbsp;</span>;   
    });
  }

  displayCsvRecords = () => {
    var html = '';
    var i=0;
    for (i=0; i<this.state.csvData.length-1; i++)
    {
      var j =0;
      html = html + '<tr>';
      for (j=0; j<this.state.csvData[i].length; j++)
      {
        if(i==0)
          html = html+'<th>'+this.state.csvData[i][j]+'</th>';
        else
          html = html+'<td>'+this.state.csvData[i][j]+'</td>';
        //console.log(this.state.csvData[i][j]);
      }
      html = html + '</tr>';
    }
    return parse(html);
  }

  handleChange = (event) => {
    this.setState({titleInput: event.target.value});
  }

  searchBooks = () => {
    var title_input = this.state.titleInput;
    //alert(title_input);
    //key: "AIzaSyAcDv9F4laGuzRsImeIGrl0GgzbrynOrhs",
      
    var options = {
      key: "AIzaSyAcDv9F4laGuzRsImeIGrl0GgzbrynOrhs",
      field: 'title',
      offset: 0,
      limit: 10,
      type: 'books',
      order: 'relevance',
      lang: 'en',
      country: 'IN'
    };
    var googleBooksData = [];

    var title, author_1, author_2, author_3, publisher, published_year, 
      description, page_count, language, google_id, google_link, thumbnail = ""; 

    books.search(title_input, options, (error, results, apiResponse) => {
      if ( ! error ) {

        results.map((topLevel, key1) => {
          //alert(JSON.stringify(topLevel));
          var item = topLevel;
          //alert(topLevel.categories);
          //alert(topLevel.publisher);
          if(topLevel.industryIdentifiers && topLevel.categories)
            if(topLevel.industryIdentifiers[0].identifier && topLevel.title && topLevel.authors && topLevel.thumbnail && topLevel.categories[0])
            {
              item.key = topLevel.industryIdentifiers[0].identifier;
              googleBooksData.push(item);
            }
        });
        
      }
      else {
        alert(error);
      }
      this.setState({googleBooksData: googleBooksData});
    });
  }
  
  displayGoogleBooks = () => {
    var html = '';
    //return <tr>+'key'+"::"+value.authors+</tr>;
    return this.state.googleBooksData.map((value, key) => {
      return <tr><td><img src={value.thumbnail}/></td><td>{value.title}<br/><br/>Category: {value.categories}</td><td>{value.authors[0] ? value.authors[0]: ''}<br/>{value.authors[1] ? value.authors[1]: ''}<br/>{value.authors[2] ? value.authors[2]: ''}</td>
        <td>{value.industryIdentifiers[0].identifier}</td></tr>;
      
    });
  }

  render() {
    const handleForce = (data) => {
      this.setState({
        csvData: data,
        default: false
      });
    };

    return(
      <div className="container">
        <div className="row" style={{marginTop: '20px', textAlign:'center'}}>
          <b>CSV & API sample Web page built in NodeJs with react library for better UI & inputs</b>  
        </div>
        <hr/>
        <div className="row" style={{marginTop: '30px', textAlign:'center'}}>
          <b>1. CSV Sample Program to sort based on columns</b>
          {this.state.default && (
            <p>Loading default values shared on UpWork JD</p>
            )}
          <CSVReader
            cssClass="react-csv-input"
            label="OR Select CSV file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            onFileLoaded={handleForce}
          />
          <br/>
          Total Records: {this.state.csvData.length-1} (including row-header)
          <br/>
          Sort By (click column name to sort in ascending order based on values)
          <br/>{this.sortColumns()}
        </div>
        <div className="row" style={{marginTop: '50px'}}>
          <div className="col s12 board">
            <table align='center' border='1' cellPadding='10' cellSpacing='1'>
               <tbody>
                {this.displayCsvRecords()}
               </tbody>
             </table>
          </div>
        </div>
        <hr/>
        <div className="row" style={{margin: '20px', textAlign:'center'}}>
          <b>2. Realtime Google Books Search API Sample built in NodeJS with react & google-books-search libraries</b>
          <br/><br/>
          <input type="text" value="Search by title" value={this.state.titleInput} onChange={this.handleChange}/>
          <br/><br/>
          <button onClick={()=>this.searchBooks()}>Search</button>
          <br/><br/>
          <table align='center' border='0' cellPadding='10' cellSpacing='1'>            
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Authors</th>
                <th>ISBN</th>
              </tr>
            </thead>
            <tbody>
              {this.displayGoogleBooks()}
            </tbody>
          </table>
          <br/><br/><br/>
        </div>
      </div>
    )
  }
}

export default App;
