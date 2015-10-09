var JerkRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>
          <div className="card-panel btn amber">
            <span>{this.props.jerk.licensePlate}</span>
          </div>
        </td>
        <td>{this.props.jerk.badrep}</td>
        <td>
          <button className="btn waves-effect waves-light modal-trigger" href="#modal1" data-lp={this.props.jerk.licensePlate}>
            Redeem yourself 🙏
          </button>
        </td>
      </tr>
    );
  }
});

var JerksTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.jerks.forEach(function(jerk) {
        rows.push(<JerkRow jerk={jerk} key={jerk.licensePlate} />);
      });

    return (
      <table className="centered">
        <thead>
          <tr>
            <th data-field="lp">license plate</th>
            <th data-field="bad rep">bad rep 😈</th>
            <th data-field="pay">fix your reputation maybe? 💩</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var JerksScoreBoard = React.createClass({
  getInitialState: function() {
    return {data : []}
  },
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  parseDataToJerks: function(data) {
    var jerks_arr = [];
    $.each(data, function(key, value) {
        jerks_arr.push({
          licensePlate: key,
          badrep: value
        });
      });

      return jerks_arr;
  },
  componentDidMount: function() {
    this.loadFromServer();
var self = this;
    // sub to pusher
    var channel = window.pusher.subscribe('test_channel');
			channel.bind('a_jerk', function(data) {
      console.log(data);

      self.state.data.push({
        licensePlate: data.jerkId,
        badrep: data.score
      })
		});
  },
render: function(){
    return(<JerksTable jerks = {this.parseDataToJerks(this.state.data)} />);
  }
});

ReactDOM.render(<JerksScoreBoard url="/list" />, document.getElementById('shame-score'));
