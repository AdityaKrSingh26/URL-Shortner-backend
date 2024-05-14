import { URL as urlModel } from '../models/url.model.js';
import dns from 'dns';
import geoip from 'geoip-lite';

const getInfoIp = async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const result = await urlModel.findOne({ shortId });
        const redirectURL = result.redirectURL;

        // Ensure that the redirectURL contains the protocol part
        const urlWithProtocol = redirectURL.startsWith('http') ? redirectURL : `http://${redirectURL}`;

        // Create a URL object with the corrected URL
        const urlObj = new URL(urlWithProtocol);

        // Extract the hostname from the URL object
        const hostname = urlObj.hostname;


        dns.lookup(hostname, async (err, address, family) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error resolving DNS' });
            }
            const location = await geoip.lookup(address);

            console.log('IP address:', address);
            console.log('Location:', location)
            res.status(200).json({ ipAddress: address, location });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred in fetching location' });
    }
};

export { getInfoIp };
