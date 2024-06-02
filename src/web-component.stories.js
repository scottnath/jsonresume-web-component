import { html } from 'lit';
import { microdata } from '@cucumber/microdata';
import { expect } from '@storybook/test';
import { within as shadowWithin } from 'shadow-dom-testing-library';
import stylesEven from 'jsonresume-theme-microdata/style.css?inline';
import { getWcStorybookHelpers } from "wc-storybook-helpers";

import 'profile-components/github-repository';

import resumeLorem from '@/fixtures/lorem.resume.json?raw';
import './index.js';

const { argTypes } = getWcStorybookHelpers("json-resume");

const resumeFixtureLorem = JSON.parse(resumeLorem);
const themeOptions = {...resumeFixtureLorem.meta.themeOptions};
delete resumeFixtureLorem.meta.themeOptions;

const changeSummary = (summary, json = resumeFixtureLorem) => {
  return {
    ...json,
    basics: {
      ...json.basics,
      summary: `**${summary}**

${json.basics.summary}`,
    }
  }
}

export default {
  title: 'json-resume',
  component: 'json-resume',
  argTypes,
};

export const GistID = {
  args: {
    gist_id: '54682f0aa17453d46cdc74bdef3172a3'
  },
};

export const JsonUrl = {
  args: {
    json_url: 'https://gist.githubusercontent.com/scottnath/54682f0aa17453d46cdc74bdef3172a3/raw/resume.json'
  },
};

export const MeowJSON = {
  args: {
    resumejson: resumeFixtureLorem,
  },
  play: async ({ args, canvasElement, step }) => {
    const ariaLabel = args.label || `${resumeFixtureLorem.basics.name}'s resume`;
    const screen = shadowWithin(canvasElement);
    const container = await screen.findByShadowLabelText(ariaLabel);
    console.log(container.getRootNode())
    const ppData = microdata('https://schema.org/ProfilePage', container.getRootNode())
    console.log(ppData)
    expect(ppData['@type']).toBe('ProfilePage');
    expect(ppData.mainEntity.name).toBe(resumeFixtureLorem.basics.name)
    expect(ppData.mainEntity.email).toBe(resumeFixtureLorem.basics.email)
    expect(ppData.mainEntity.telephone).toBe(resumeFixtureLorem.basics.phone)
    expect(ppData.mainEntity.url).toBe(resumeFixtureLorem.basics.url)
    if (Array.isArray(resumeFixtureLorem.basics.profiles)) {
      expect(ppData.mainEntity.ContactPoint).toHaveLength(resumeFixtureLorem.basics.profiles.length)
    }
  },
}

export const ThemeEven = {
  args: {
    resumejson: changeSummary('This resume is styled using the `even` theme. The HTML is exactly the same and so is the microdata. The stylesheet is added using the `stylesheet` attribute.'),
    stylesheet: stylesEven
  },
}

export const SectionOrder = {
  args: {
    resumejson: changeSummary('This resume determines the order of the sections according to how they are ordered in the JSON file. This requires adding the attribute `preordered` as in `<json-resume preordered="true"...`'),
    preordered: true,
  }
}

export const SectionTitles = {
  args: {
    resumejson: {
      ...changeSummary('This resume shows alternate title text for some sections. This can be configured in your `resume.json` file by adding an object to `meta.sectionTitles`. You only need to include the titles you want to change.', {
        ...resumeFixtureLorem,
        meta: {
          ...resumeFixtureLorem.meta,
          themeOptions: {
            sectionTitles: themeOptions.sectionTitles
          }
        }
      }),
    },
  }
}

export const Contained = {
  render: (args) => 
  html`<div style="margin: 0 auto; width: 100%; max-width: ${args.maxwidth || 52}em;">
    <json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}"></json-resume></div>
  `,
  args: {
    resumejson: changeSummary('This resume is boxed into a container'),
    preordered: true,
  },
}

export const Slots = {
  render: (args) => 
  html`<json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}">
      <section slot="work"><h3>I am a slotted H3 header for the Work section</h3><article><h4>I am a slotted H4</h4></article></section>
      <section slot="projects"><h3>Open Source Projects</h3><github-repository full_name="scottnath/profile-components" fetch="true" data-theme="light"></github-repository><github-repository full_name="scottnath/jsonresume-theme-microdata" fetch="true" data-theme="light"></github-repository></section>
    </json-resume>
  `,
  args: {
    resumejson: changeSummary('This resume replaces individual sections using `slots`. There is a slot for every JSON Resume section. In this example, `work` is replaced with a similar HTML structure, but `projects` is replaced with a series of web components. The slotted content does not get styling from the web component.'),
    preordered: true,
  },
}

export const Styling = {
  render: (args) => 
  html`<json-resume .resumejson="${args.resumejson}" preordered="${args.preordered}">
      <section slot="work"><h3>My Work as a Meow</h3><article><h4>Job Title Meow</h4></article></section>
    </json-resume>
  `,
  args: {
    resumejson: changeSummary('This resume has its styles adjusted using CSS custom properties and CSS shadow parts via `::part()`'),
    preordered: true,
  },
  decorators: [(story) => html`<div>
    <style>
      json-resume {
        --color-background: white;
        --color-dimmed: green;
        --color-primary: var(--color-primary-light);
        --color-secondary: var(--color-secondary-light);
        --color-accent: var(--color-accent-light);
      }
      json-resume::part(name) {
        color: red;
        text-transform: uppercase;
      }
      json-resume::part(summary) {
        color: purple;
        font-family: 'Comic Sans MS';
      }
      json-resume::part(contact) {
        position: relative;
        top: 0;
        background: black;
        --color-primary: white;
        --color-link: var(--color-link-dark);
        color: var(--color-primary);
      }
      json-resume::part(skills) {
        background: green;
        --color-primary: white;
        color: var(--color-primary);
      }
      
      json-resume::part(section-title){
        text-transform: uppercase;
        background-image: linear-gradient(
        -225deg,
        #231557 0%,
        #44107a 29%,
        #ff1361 67%,
        #fff800 100%
        );
        background-size: auto auto;
        background-clip: border-box;
        background-size: 200% auto;
        color: #fff;
        background-clip: text;
        text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 4em;
      }
    </style>
    ${story()}
  </div>`]
}

export const ThemeOptions = {
  args: {
    resumejson: {
      ...changeSummary('This resume shows all theme options, including section titles, preordered, and colors. These are detailed in `jsonresume-theme-microdata`.', {
        ...resumeFixtureLorem,
        meta: {
          ...resumeFixtureLorem.meta,
          themeOptions
        }
      }),
    },
  }
}

export const Stylesheet = {
  args: {
    resumejson: changeSummary('This resume replaces the default styles using the `stylesheet` property. You can add an entire stylesheet, but here just a few styles were added. This will **completely override** the default styles.'),
    stylesheet: `
      :host {
        font-family: 'Comic Sans MS'
      }
      [itemscope]#jsonresume > article {
        background: green;
        color: yellow;
      }
      [part="basics"] [itemprop="description"] {
        font-size: 3em;
      }
    `,
    preordered: true
  },
}


export const NoAttr = {
};

export const BadGist = {
  args: {
    gist_id: '12345'
  },
};

export const BadUrl = {
  args: {
    json_url: 'https://gist.githubusercontent.com/scottnath/54682f0aa17453d46cdc74bdef3172a3'
  },
};
