import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode-react';
import RaisedButton from 'material-ui/RaisedButton';
import MyReadsImage from './icons/myreads.jpg';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';

class AccountQRCode extends Component {
	static propTypes = {
		// Books from the Shelves
		value: PropTypes.string.isRequired,
	};

	componentDidMount(){
		const app = this;
		const link = this.downloadButton;
		//link.textContent = 'download image';

		link.addEventListener('click', function(ev) {
			console.log(app.qrCanvas);
			link.href = app.qrCanvas.refs.canvas.toDataURL();
			link.download = "myreads_account_backup.png";
		}, false);
	}

	render() {
		const {value} = this.props;

		return (
			<div>
				<QRCode
					ref={(qrCode) => { this.qrCanvas = qrCode; }}
					fgColor="#323266" size={240}
					value={value}
					logoWidth={48}
					logo={MyReadsImage}
				/>
				<div>
					<a ref={(download) => { this.downloadButton = download; }}>
					<RaisedButton
						label="Download QR Code"
						icon={<FileFileDownload />}
					/>
					</a>
				</div>
			</div>
		);
	};
}

export default AccountQRCode;