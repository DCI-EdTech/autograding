// @ts-nocheck

const colorVariants = {
  full: {
    stroke: '#A5F2DC',
    fill: '#DEFFF5',
    label: 'Tasks',
    ctaStroke: '#00E0A1',
    ctaFill: '#00E0A1',
    ctaFontColor: '#0E123B',
    icon: `<g id="Icon" transform="translate(20.000000, 7.000000)">
              <polygon id="Full" fill="#00E0A1" points="1.06728745 2.69917297 19.0803909 2.69917297 16.2599831 18.7211496 14.4799805 19.5198793 5.80393219 19.5198793 3.21572876 18.7211496"></polygon>
              <g id="Glass" stroke="#0E123B">
                  <path d="M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z" id="Rectangle"></path>
                  <polyline id="Line" stroke-linecap="square" stroke-linejoin="round" points="3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587"></polyline>
              </g>
          </g>
          <g id="All" transform="translate(26.500000, 14.000000)" stroke="#0E123B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <line x1="0" y1="4.78849792" x2="2.5" y2="7.28849792" id="Line"></line>
              <line x1="7.11474228" y1="0" x2="2.5" y2="7.28849792" id="Line"></line>
          </g>`
  },
  partial: {
    stroke: '#FEF1AF',
    fill: '#FFF9D9',
    label: 'Tasks',
    ctaStroke: '#FEDA2E',
    ctaFill: '#FEDA2E',
    ctaFontColor: '#0E123B',
    icon: `<g id="Icon" transform="translate(20.000000, 7.000000)">
              <polygon id="Half-full" fill="#FEDA2E" points="1.47357941 9.51987934 18.3122101 9.51987934 16.2599831 18.7211496 14.4799805 19.5198793 5.80393219 19.5198793 3.21572876 18.7211496"></polygon>
              <g id="Glass" stroke="#0E123B">
                  <path d="M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z" id="Rectangle"></path>
                  <polyline id="Line" stroke-linecap="square" stroke-linejoin="round" points="3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587"></polyline>
              </g>
          </g>`
  },
  none: {
    stroke: '#F5A4C2',
    fill: '#FFE6EF',
    label: 'Pushed?',
    ctaStroke: '#EF065B',
    ctaFill: '#EF065B',
    ctaFontColor: '#FFFFFF',
    icon: `<g id="Icon" transform="translate(20.000000, 7.000000)">
              <g id="Glass" stroke="#0E123B">
                  <path d="M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z" id="Rectangle"></path>
                  <polyline id="Line" stroke-linecap="square" stroke-linejoin="round" points="3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587"></polyline>
              </g>
              <g id="None" transform="translate(6.000000, 6.000000)" stroke="#EF065B" stroke-linecap="round" stroke-width="2">
                  <line x1="0.5" y1="0.5" x2="7.5" y2="7.5" id="Line"></line>
                  <line x1="7.5" y1="0.5" x2="0.5" y2="7.5" id="Line"></line>
              </g>
          </g>`
  }
}

export default function badge(testResults) {
  const tasksCompleted = testResults.filter(testResult => {
    return !testResult.find(result => result.status !== 'passed')
  }).length

  let colors = colorVariants.none
  if(tasksCompleted > 0) colors = colorVariants.partial
  if(tasksCompleted == testResults.length) colors = colorVariants.full
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="277px" height="38px" viewBox="0 0 277 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>badge_some</title>
    <g id="Badges" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-49.000000, -135.000000)" id="Light">
            <g transform="translate(50.000000, 50.000000)">
                <g id="Group" transform="translate(0.000000, 86.000000)">
                    <rect id="Background" stroke="${colors.stroke}" fill="${colors.fill}" x="0" y="0" width="275" height="36" rx="6"></rect>
                    <g id="CTA" transform="translate(170.000000, 0.000000)">
                        <path d="M0,0 L99,0 C102.313708,-6.08718376e-16 105,2.6862915 105,6 L105,30 C105,33.3137085 102.313708,36 99,36 L0,36 L0,36 L0,0 Z" id="CTA-Background" stroke="${colors.ctaStroke}" fill="${colors.ctaFill}"></path>
                        <text id="CTA-Text" font-family="Arial-BoldMT, Arial" font-size="15" font-weight="bold" fill="${colors.ctaFontColor}">
                            <tspan x="28.4052734" y="24">${colors.label}</tspan>
                        </text>
                    </g>
                    <text id="Score" font-family="Arial-BoldMT, Arial" font-size="15" font-weight="bold" fill="#0E123B">
                        <tspan x="107" y="24">${tasksCompleted}/${testResults.length}</tspan>
                    </text>
                    <text id="Tests" font-family="ArialMT, Arial" font-size="15" font-weight="normal" fill="#0E123B">
                        <tspan x="54" y="24">Tasks</tspan>
                    </text>
                    ${colors.icon}
                </g>
            </g>
        </g>
    </g>
</svg>`
}