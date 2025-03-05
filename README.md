# Swap Exchange Service

<p>Welcome to Ben's Swap Exchange Service!</p>

![image](https://github.com/user-attachments/assets/181a6ecd-33c2-467c-8c5f-f0d9dbf91bfa)

## Installation

### <u>Prerequisites</u>
* Node: https://nodejs.org/en
* Git: https://git-scm.com/downloads
* Visual Studio Code: https://code.visualstudio.com/

### <u>Repository Setup</u>
<p>To install all node dependencies, in project <b>root</b> terminal run:</p>
<pre>npm install</pre>
<p>To run application, in project <b>root</b> terminal run:</p>
<pre>npm run dev</pre>

## Features
### <u>Exchange Rates</u>
<p>Based on <b>USD</b>.</p>

| HKD  | AUD  | MYR  | GBP  | EUR  | IDR       | NZD  | CNY  | CZK  | AED  |
|------|------|------|------|------|-----------|------|------|------|------|
| 7.80 | 1.49 | 4.38 | 0.76 | 0.90 | 15,538.91 | 1.63 | 7.14 | 22.55 | 3.67 |


### <u>Features</u>
* Select BUY and SELL currency.
* Input SELL amount in desired currency, to output the amount that I'm able to buy.
* Input BUY amount in desired currency, to output the amount that I have to pay.
* Perform swap so that BUYING and SELLING asset interchange on interface. 
* Single unit rate display to show current exchange rate on chosen currencies. 
* Exchange rate calculation, introducing 1% fee charge.
* [Additonal Mock Feature] Fetching currency exchange rate prices. 
* [Additonal Mock Feature] Perform exchange for desired currency. 

## Architecture
* Built using <b>React + NextJs + TailwindCSS + Turbo</b>.
* Testing using <b>React Testing Framework + Jest</b>.
* Monorepo housed with <b>TurboRepo + NPM Workspace</b>.
* <i>Not publised on NPM</i>. 

### <u>Applications</u>
<b>currency-swap</b>: 
<pre>Currency swap exchange application.</pre>
<b>@repo/ui</b>: 
<pre>
Package dependency that holds reusable components with Tests.
Consumed by currency-swap application.
Components: <b>Accordion, NumberInput, Dropdown, Button, Modal, Grid</b>
</pre>

### <u>Why TurboRepo with NPM Workspace?</u>
<p>
TurboRepo speeds up builds and CI/CD with caching and parallel execution, while NPM Workspaces keeps dependency management simple and makes code sharing easy. Both combine creates a smooth, scalable monorepo setup with strong support for Next.js, making it easy to migrate existing SPA's into the monorepo and hassle-free deployments on Vercel.
</p>

# - END -
