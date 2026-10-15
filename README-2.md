# LifeLink Mesh

An SOS communication concept for places with no normal network, such as floods, earthquakes, remote hills or crowded events where towers fail.

Phones form a **mesh network** with each other. An SOS message hops from one phone to the next until it reaches a rescue base or a phone that has internet.

## Problem
When mobile towers go down, people cannot call for help even if rescue teams are nearby.

## Idea
- Every phone running LifeLink acts as a small relay.
- Phones talk directly using Bluetooth Low Energy or Wi-Fi Direct.
- SOS packets carry location, a short message and a time stamp.
- If a phone goes offline, the message finds another route.

## Architecture
```
 [Victim phone] --> [Relay phone] --> [Relay phone] --> [Rescue base]
                         |                 |
                    [Relay phone] ---------+
```

| Layer | What it does |
|-------|--------------|
| App | One-tap SOS button, location, short message |
| Mesh | Store-and-forward relay between nearby phones |
| Radio | Bluetooth LE or Wi-Fi Direct |
| Gateway | Any phone with internet forwards SOS to rescue servers |
| Rescue dashboard | Map of SOS messages for rescue teams |

## SOS Packet (example)
```
{
  "id": "unique-message-id",
  "lat": 28.6139,
  "lon": 77.2090,
  "message": "Need medical help",
  "time": "2026-10-15T08:00:00Z",
  "hops": 0,
  "max_hops": 10
}
```

## Features (concept)
- Works without SIM, mobile data or Wi-Fi
- Automatic multi-hop forwarding
- Duplicate message filtering using message id
- Hop limit to stop endless forwarding
- Low battery mode

## Demo
Open `index.html` in a browser (it uses `style.css` and `script.js` from the same folder). Tap phones to switch them off, then press **Send SOS** to see the message find a new route.

## Challenges
- Battery usage of constant radio scanning
- Short radio range (about 30 to 100 metres per hop)
- Privacy of location data
- Needs enough nearby phones with the app installed

## Future Work
- Android app prototype
- Message encryption
- Rescue team dashboard
- Testing with real devices

## Author
Aman Yadav
GitHub: https://github.com/amanyadav991980
