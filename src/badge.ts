// @ts-nocheck

const colorVariants = {
  full: {
    stroke: '#A5F2DC',
    fill: '#DEFFF5',
    label: 'Details',
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
          </g>`,
    ctaLeft: 28.4052734
  },
  partial: {
    stroke: '#FEF1AF',
    fill: '#FFF9D9',
    label: 'Details',
    ctaStroke: '#FEDA2E',
    ctaFill: '#FEDA2E',
    ctaFontColor: '#0E123B',
    icon: `<g id="Icon" transform="translate(20.000000, 7.000000)">
              <polygon id="Half-full" fill="#FEDA2E" points="1.47357941 9.51987934 18.3122101 9.51987934 16.2599831 18.7211496 14.4799805 19.5198793 5.80393219 19.5198793 3.21572876 18.7211496"></polygon>
              <g id="Glass" stroke="#0E123B">
                  <path d="M19.4181624,0.5 L16.2227096,21.5 L3.79691031,21.5 L0.582360868,0.5 L19.4181624,0.5 Z" id="Rectangle"></path>
                  <polyline id="Line" stroke-linecap="square" stroke-linejoin="round" points="3.77687454 18.5397587 5.60838318 19.5 14.7425766 19.5 16.2599831 18.5397587"></polyline>
              </g>
          </g>`,
    ctaLeft: 28.4052734
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
          </g>`,
    ctaLeft: 21.3300781
  }
}

export default function badge(tasks) {
  let colors = colorVariants.none
  if(tasks.completed > 0) colors = colorVariants.partial
  if(tasks.completed > 0 && tasks.completed == tasks.total) colors = colorVariants.full
  
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
                            <tspan x="${colors.ctaLeft}" y="24">${colors.label}</tspan>
                        </text>
                    </g>
                    <text id="Score" font-family="Arial-BoldMT, Arial" font-size="15" font-weight="bold" fill="#0E123B">
                        <tspan x="107" y="24">${tasks.completed}/${tasks.total}</tspan>
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

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="396px" height="38px" viewBox="0 0 396 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <rect id="path-1" x="8.7174294" y="11.6677099" width="20.8812844" height="10.8630402" rx="3.82122905"></rect>
        <filter x="-2.4%" y="-4.6%" width="104.8%" height="109.2%" filterUnits="objectBoundingBox" id="filter-2">
            <feGaussianBlur stdDeviation="0.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="0" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0.9218   0 0 0 0 0.790676768   0 0 0 0 0.1582  0 0 0 1 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
        <ellipse id="path-3" cx="19.1580716" cy="2.41400894" rx="2.43277099" ry="2.41400894"></ellipse>
        <filter x="-10.3%" y="-10.4%" width="120.6%" height="120.7%" filterUnits="objectBoundingBox" id="filter-4">
            <feGaussianBlur stdDeviation="0.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="0" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0.9218   0 0 0 0 0.790676768   0 0 0 0 0.1582  0 0 0 1 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-101.000000, -743.000000)">
            <g transform="translate(101.000000, 744.000000)">
                <g transform="translate(120.000000, 0.000000)">
                    <rect id="Background" stroke="${colors.stroke}" fill="${colors.fill}" x="0" y="0" width="275" height="36" rx="6"></rect>
                    <g id="CTA" transform="translate(170.000000, 0.000000)">
                        <path d="M0,0 L99,0 C102.313708,-6.08718376e-16 105,2.6862915 105,6 L105,30 C105,33.3137085 102.313708,36 99,36 L0,36 L0,36 L0,0 Z" id="CTA-Background" stroke="${colors.ctaStroke}" fill="${colors.ctaFill}"></path>
                        <text id="CTA-Text" font-family="Arial-BoldMT, Arial" font-size="15" font-weight="bold" fill="#0E123B">
                            <tspan x="${colors.ctaLeft}" y="24">${colors.label}</tspan>
                        </text>
                    </g>
                    <text id="Score" font-family="Arial-BoldMT, Arial" font-size="15" font-weight="bold" fill="#0E123B">
                        <tspan x="107" y="24">${tasks.completed}/${tasks.total}</tspan>
                    </text>
                    <text id="Tests" font-family="ArialMT, Arial" font-size="15" font-weight="normal" fill="#0E123B">
                        <tspan x="54" y="24">Tasks</tspan>
                    </text>
                    ${colors.icon}
                </g>
                <g id="Logo">
                    <g id="Bot">
                        <rect id="Rectangle" fill="#00CC93" x="4.66281107" y="7.64436165" width="28.990521" height="25.1459265" rx="4.82681564"></rect>
                        <polygon id="Path" fill="#0E123B" fill-rule="nonzero" transform="translate(19.176236, 27.924551) rotate(-90.000000) translate(-19.176236, -27.924551) " points="19.0957008 31.6842131 19.0957008 24.1542367 20.2449376 24.1542367 20.2449376 23.1422106 18.1075339 23.1422106 18.1075339 32.7068921 20.2449376 32.7068921 20.2449376 31.6842131"></polygon>
                        <g id="Rectangle">
                            <use fill="#FEDA2E" fill-rule="evenodd" xlink:href="#path-1"></use>
                            <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                        </g>
                        <polygon id="Path" fill="#0E123B" fill-rule="nonzero" points="13.5829714 14.6852211 13.5829714 19.5132389 14.596626 19.5132389 14.596626 14.6852211"></polygon>
                        <ellipse id="Oval" stroke="#0E123B" stroke-width="1.00558659" cx="23.1113244" cy="17.09923" rx="1.9299777" ry="1.91121565"></ellipse>
                        <polygon id="Path" fill="#00CC93" fill-rule="nonzero" points="18.3471479 3.82218082 18.3471479 8.65019871 19.9689952 8.65019871 19.9689952 3.82218082"></polygon>
                        <g id="Oval">
                            <use fill="#FEDA2E" fill-rule="evenodd" xlink:href="#path-3"></use>
                            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                        </g>
                        <path d="M0.571332582,21.7352244 C2.17474983,20.8391151 3.1423292,19.2754956 3.1423292,17.2546775 L3.1423292,16.9895023 C3.1423292,14.9686842 2.17474983,13.3684889 0.571332582,12.4723795 L0,13.1673215 C1.22560054,14.0634309 1.99044903,15.3070112 1.99044903,16.9986463 L1.99044903,17.2546775 C1.99044903,18.9463126 1.22560054,20.1441731 0,21.0311385 L0.571332582,21.7352244 Z" id="Path" fill="#86889E" fill-rule="nonzero" transform="translate(1.571165, 17.103802) scale(-1, 1) translate(-1.571165, -17.103802) "></path>
                        <path d="M35.7451465,21.7352244 C37.3485638,20.8391151 38.3161432,19.2754956 38.3161432,17.2546775 L38.3161432,16.9895023 C38.3161432,14.9686842 37.3485638,13.3684889 35.7451465,12.4723795 L35.173814,13.1673215 C36.3994145,14.0634309 37.164263,15.3070112 37.164263,16.9986463 L37.164263,17.2546775 C37.164263,18.9463126 36.3994145,20.1441731 35.173814,21.0311385 L35.7451465,21.7352244 Z" id="Path" fill="#86889E" fill-rule="nonzero"></path>
                    </g>
                    <g id="Text" transform="translate(51.432608, 3.663442)" fill="#86889E" fill-rule="nonzero">
                        <path d="M5.78183241,12.1669842 C8.62827298,12.1669842 10.4072983,10.3611788 11.0299572,8.59977839 L9.93289158,8.08171945 C9.29540749,9.79871479 7.96113848,11.0124529 5.82630805,11.0124529 C3.20224564,11.0124529 1.27496817,8.96982049 1.27496817,6.21670727 C1.27496817,3.419189 3.35049776,1.49497008 5.81148283,1.49497008 C8.22799228,1.49497008 9.44365961,2.97513848 9.91806637,4.39610014 L11.015132,3.89284288 C10.4665992,2.13144249 8.68757383,0.340438731 5.84113326,0.340438731 C2.66853804,0.340438731 0,2.7679149 0,6.29071569 C0,9.7839131 2.57958677,12.1669842 5.78183241,12.1669842 Z" id="Path"></path>
                        <path d="M16.4115089,12.1817859 C18.7242419,12.1817859 20.5180925,10.4055838 20.5180925,8.06691776 C20.5180925,5.80226012 18.7242419,4.01125636 16.4411593,4.01125636 C14.098776,4.01125636 12.3345758,5.78745843 12.3345758,8.1261245 C12.3345758,10.3759805 14.1136012,12.1817859 16.4115089,12.1817859 Z M16.4411593,11.1604697 C14.7066096,11.1604697 13.5205927,9.72470637 13.5205927,8.06691776 C13.5205927,6.40912916 14.6917844,5.01777087 16.4115089,5.01777087 C18.1312334,5.01777087 19.3320756,6.4683359 19.3320756,8.1261245 C19.3320756,9.76911142 18.1312334,11.1604697 16.4411593,11.1604697 Z" id="Shape"></path>
                        <path d="M21.9857884,8.08171945 C21.9857884,10.2427653 23.4238339,12.1669842 25.6920912,12.1669842 C27.219088,12.1669842 28.1679015,11.3676933 28.7757352,10.3611788 L28.7757352,12.0485708 L29.9024512,12.0485708 L29.9024512,0 L28.7609099,0 L28.7609099,5.80226012 C28.1234259,4.86975403 27.219088,4.01125636 25.6920912,4.01125636 C23.4534843,4.01125636 21.9857884,6.02428538 21.9857884,8.08171945 Z M25.9292946,11.145668 C24.1947449,11.145668 23.1569801,9.73950805 23.1569801,8.11132282 C23.1569801,6.40912916 24.1947449,5.03257255 25.9292946,5.03257255 C27.574893,5.03257255 28.7757352,6.49793926 28.7757352,8.06691776 C28.7757352,9.695103 27.6045435,11.145668 25.9292946,11.145668 Z" id="Shape"></path>
                        <path d="M39.5240134,8.45176155 C39.5388386,8.33334808 39.5388386,8.20013292 39.5388386,8.06691776 C39.5388386,5.75785506 38.2490452,4.01125636 35.8028853,4.01125636 C33.5791036,4.01125636 31.9483304,5.93547527 31.9483304,8.08171945 C31.9483304,10.3611788 33.6680549,12.1817859 35.9659626,12.1817859 C37.3595325,12.1817859 38.6345007,11.4565034 39.3164604,10.1391535 L38.4565981,9.57668953 C38.0118418,10.4795923 37.1075039,11.1604697 35.9511374,11.1604697 C34.4093155,11.1604697 33.2084733,9.99113668 33.1195221,8.45176155 L39.5240134,8.45176155 Z M33.1343473,7.4748504 C33.327075,6.15750053 34.4241407,5.01777087 35.8028853,5.01777087 C37.3150569,5.01777087 38.2193948,6.03908706 38.3676469,7.4748504 L33.1343473,7.4748504 Z" id="Shape"></path>
                        <path d="M0.68195972,16.8539963 L0.68195972,28.4437148 L5.26295002,28.4437148 C8.03526453,28.4437148 9.38435876,27.0671582 9.38435876,25.202146 C9.38435876,24.2844416 8.93960242,22.9670917 7.17540228,22.4046278 C8.55414693,21.782957 8.85065115,20.5248139 8.85065115,19.9031432 C8.85065115,17.9937259 7.3384796,16.8539963 5.1146979,16.8539963 L0.68195972,16.8539963 Z M2.4906355,21.7533537 L2.4906355,18.4969832 L4.87749452,18.4969832 C6.43414171,18.4969832 7.02715016,19.207464 7.02715016,20.0955651 C7.02715016,20.9836661 6.36001565,21.7533537 4.77371804,21.7533537 L2.4906355,21.7533537 Z M2.4906355,26.8007279 L2.4906355,23.3519355 L5.17399875,23.3519355 C6.84924763,23.3519355 7.56085777,24.1068214 7.56085777,25.0541292 C7.56085777,26.0606437 6.80477199,26.8007279 5.29260044,26.8007279 L2.4906355,26.8007279 Z" id="Shape"></path>
                        <path d="M12.9424095,20.5396156 L11.1782093,20.5396156 L11.1782093,25.3945679 C11.1782093,27.2003734 12.1566733,28.6065333 14.1432516,28.6065333 C14.7659105,28.6065333 15.8036753,28.3993098 16.559761,27.3779936 L16.559761,28.4437148 L18.2794855,28.4437148 L18.2794855,20.5396156 L16.5152854,20.5396156 L16.5152854,24.9357157 C16.5152854,26.1346521 15.8036753,26.933943 14.6917844,26.933943 C13.4761171,26.933943 12.9424095,26.0902471 12.9424095,24.9653191 L12.9424095,20.5396156 Z" id="Path"></path>
                        <path d="M20.1029865,24.4768635 C20.1029865,26.608306 21.7189346,28.5621283 24.0020171,28.5621283 C24.6395012,28.5621283 26.0330711,28.2364912 26.6557299,27.215175 L26.6557299,28.4437148 L28.3754545,28.4437148 L28.3754545,16.3951441 L26.6112543,16.3951441 L26.6112543,21.6645436 C26.0182459,20.7320375 24.7432777,20.3915987 24.0464928,20.3915987 C21.5706825,20.3915987 20.1029865,22.4934379 20.1029865,24.4768635 Z M26.6409047,24.4768635 C26.6409047,25.8386184 25.6920912,26.9635464 24.2688709,26.9635464 C22.8456506,26.9635464 21.8968371,25.8386184 21.8968371,24.4768635 C21.8968371,23.1151086 22.8308254,21.9753789 24.2688709,21.9753789 C25.6920912,21.9753789 26.6409047,23.1151086 26.6409047,24.4768635 Z" id="Shape"></path>
                        <path d="M30.1989554,24.4768635 C30.1989554,26.608306 31.8149035,28.5621283 34.097986,28.5621283 C34.7354701,28.5621283 36.12904,28.2364912 36.7516988,27.215175 L36.7516988,28.4437148 L38.4714234,28.4437148 L38.4714234,16.3951441 L36.7072232,16.3951441 L36.7072232,21.6645436 C36.1142148,20.7320375 34.8392466,20.3915987 34.1424617,20.3915987 C31.6666514,20.3915987 30.1989554,22.4934379 30.1989554,24.4768635 Z M36.7368736,24.4768635 C36.7368736,25.8386184 35.7880601,26.9635464 34.3648398,26.9635464 C32.9416195,26.9635464 31.992806,25.8386184 31.992806,24.4768635 C31.992806,23.1151086 32.9267943,21.9753789 34.3648398,21.9753789 C35.7880601,21.9753789 36.7368736,23.1151086 36.7368736,24.4768635 Z" id="Shape"></path>
                        <polygon id="Path" points="44.3718575 25.720205 41.9108724 20.5396156 39.8946436 20.5396156 43.4230439 27.5556138 41.2437379 32.3365577 43.1265397 32.3365577 48.5673923 20.5396156 46.65494 20.5396156"></polygon>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`
}