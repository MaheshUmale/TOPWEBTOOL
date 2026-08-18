/* TopWebTool — US state defaults for money calculators.
   Planning defaults (2026 approximations): effective property-tax rate (annual %),
   typical home-insurance premium ($/yr), and the state Housing Finance Agency for
   first-time-buyer programs. County-level rates vary widely — users should verify.
   No tracking: selection is stored only in the visitor's own browser (localStorage). */
(function () {
  var STATES = [
    { code: "AL", name: "Alabama", tax: 0.4, ins: 1800, hfa: "AHFA", hfaUrl: "https://www.alabamahousing.com" },
    { code: "AK", name: "Alaska", tax: 1.0, ins: 1500, hfa: "AHFC", hfaUrl: "https://www.ahfc.us" },
    { code: "AZ", name: "Arizona", tax: 0.6, ins: 2000, hfa: "Arizona Dept. of Housing", hfaUrl: "https://housing.az.gov" },
    { code: "AR", name: "Arkansas", tax: 0.6, ins: 1900, hfa: "ADFA", hfaUrl: "https://adfa.arkansas.gov" },
    { code: "CA", name: "California", tax: 0.7, ins: 1800, hfa: "CalHFA", hfaUrl: "https://www.calhfa.ca.gov" },
    { code: "CO", name: "Colorado", tax: 0.5, ins: 3000, hfa: "CHFA", hfaUrl: "https://www.chfainfo.com" },
    { code: "CT", name: "Connecticut", tax: 1.8, ins: 2000, hfa: "CHFA", hfaUrl: "https://www.chfa.org" },
    { code: "DE", name: "Delaware", tax: 0.6, ins: 1700, hfa: "DSHA", hfaUrl: "https://www.destatehousing.com" },
    { code: "FL", name: "Florida", tax: 0.8, ins: 6000, hfa: "Florida Housing", hfaUrl: "https://www.floridahousing.org" },
    { code: "GA", name: "Georgia", tax: 0.9, ins: 2100, hfa: "Georgia Dream (DCA)", hfaUrl: "https://dca.georgia.gov" },
    { code: "HI", name: "Hawaii", tax: 0.3, ins: 1500, hfa: "HHFDC", hfaUrl: "https://dbedt.hawaii.gov/hhfdc" },
    { code: "ID", name: "Idaho", tax: 0.5, ins: 1600, hfa: "IHFA", hfaUrl: "https://www.idahohousing.com" },
    { code: "IL", name: "Illinois", tax: 2.1, ins: 2200, hfa: "IHDA", hfaUrl: "https://www.ihda.org" },
    { code: "IN", name: "Indiana", tax: 0.8, ins: 1800, hfa: "IHCDA", hfaUrl: "https://www.in.gov/ihcda" },
    { code: "IA", name: "Iowa", tax: 1.4, ins: 2200, hfa: "Iowa Finance Authority", hfaUrl: "https://www.iowafinance.com" },
    { code: "KS", name: "Kansas", tax: 1.3, ins: 2800, hfa: "KHRC", hfaUrl: "https://kshousingcorp.org" },
    { code: "KY", name: "Kentucky", tax: 0.8, ins: 2100, hfa: "KHC", hfaUrl: "https://www.kyhousing.org" },
    { code: "LA", name: "Louisiana", tax: 0.6, ins: 4000, hfa: "Louisiana Housing", hfaUrl: "https://lhc.la.gov" },
    { code: "ME", name: "Maine", tax: 1.1, ins: 1600, hfa: "MaineHousing", hfaUrl: "https://www.mainehousing.org" },
    { code: "MD", name: "Maryland", tax: 1.0, ins: 1900, hfa: "Maryland CDA", hfaUrl: "https://dhcd.maryland.gov" },
    { code: "MA", name: "Massachusetts", tax: 1.0, ins: 1900, hfa: "MassHousing", hfaUrl: "https://www.masshousing.com" },
    { code: "MI", name: "Michigan", tax: 1.2, ins: 2100, hfa: "MSHDA", hfaUrl: "https://www.michigan.gov/mshda" },
    { code: "MN", name: "Minnesota", tax: 1.1, ins: 2100, hfa: "Minnesota Housing", hfaUrl: "https://www.mnhousing.gov" },
    { code: "MS", name: "Mississippi", tax: 0.8, ins: 2000, hfa: "Mississippi Home Corp", hfaUrl: "https://www.msmhc.com" },
    { code: "MO", name: "Missouri", tax: 1.0, ins: 2200, hfa: "MHDC", hfaUrl: "https://mhdc.com" },
    { code: "MT", name: "Montana", tax: 0.8, ins: 1800, hfa: "Montana Housing", hfaUrl: "https://housing.mt.gov" },
    { code: "NE", name: "Nebraska", tax: 1.6, ins: 2800, hfa: "NIFA", hfaUrl: "https://www.nifa.org" },
    { code: "NV", name: "Nevada", tax: 0.5, ins: 1900, hfa: "Nevada Housing Division", hfaUrl: "https://housing.nv.gov" },
    { code: "NH", name: "New Hampshire", tax: 1.9, ins: 1700, hfa: "NHHFA", hfaUrl: "https://www.nhhfa.org" },
    { code: "NJ", name: "New Jersey", tax: 2.2, ins: 1700, hfa: "NJHMFA", hfaUrl: "https://www.njhousing.gov" },
    { code: "NM", name: "New Mexico", tax: 0.7, ins: 1800, hfa: "MFA New Mexico", hfaUrl: "https://www.hnmfa.org" },
    { code: "NY", name: "New York", tax: 1.6, ins: 1600, hfa: "SONYMA", hfaUrl: "https://hcr.ny.gov" },
    { code: "NC", name: "North Carolina", tax: 0.8, ins: 2200, hfa: "NCHFA", hfaUrl: "https://www.nchfa.com" },
    { code: "ND", name: "North Dakota", tax: 1.0, ins: 1800, hfa: "NDHFA", hfaUrl: "https://www.ndhfa.org" },
    { code: "OH", name: "Ohio", tax: 1.5, ins: 1600, hfa: "OHFA", hfaUrl: "https://myohiohome.org" },
    { code: "OK", name: "Oklahoma", tax: 0.9, ins: 3000, hfa: "OHFA", hfaUrl: "https://www.ohfa.org" },
    { code: "OR", name: "Oregon", tax: 0.9, ins: 1700, hfa: "Oregon Housing", hfaUrl: "https://www.oregon.gov/ohcs" },
    { code: "PA", name: "Pennsylvania", tax: 1.4, ins: 1600, hfa: "PHFA", hfaUrl: "https://www.phfa.org" },
    { code: "RI", name: "Rhode Island", tax: 1.5, ins: 1800, hfa: "RIHousing", hfaUrl: "https://www.rihousing.com" },
    { code: "SC", name: "South Carolina", tax: 0.6, ins: 2200, hfa: "SC Housing", hfaUrl: "https://schousing.com" },
    { code: "SD", name: "South Dakota", tax: 1.2, ins: 2000, hfa: "SDHDA", hfaUrl: "https://www.sdhda.org" },
    { code: "TN", name: "Tennessee", tax: 0.6, ins: 2100, hfa: "THDA", hfaUrl: "https://thda.org" },
    { code: "TX", name: "Texas", tax: 1.6, ins: 3500, hfa: "TSAHC", hfaUrl: "https://www.tsahc.org" },
    { code: "UT", name: "Utah", tax: 0.6, ins: 1500, hfa: "Utah Housing", hfaUrl: "https://www.utahhousingcorp.org" },
    { code: "VT", name: "Vermont", tax: 1.8, ins: 1600, hfa: "VHFA", hfaUrl: "https://www.vhfa.org" },
    { code: "VA", name: "Virginia", tax: 0.8, ins: 1800, hfa: "VHDA", hfaUrl: "https://www.vhda.com" },
    { code: "WA", name: "Washington", tax: 0.9, ins: 1500, hfa: "WSHFC", hfaUrl: "https://wshfc.org" },
    { code: "WV", name: "West Virginia", tax: 0.6, ins: 1600, hfa: "WVHDF", hfaUrl: "https://www.wvhdf.com" },
    { code: "WI", name: "Wisconsin", tax: 1.6, ins: 1700, hfa: "WHEDA", hfaUrl: "https://www.wheda.com" },
    { code: "WY", name: "Wyoming", tax: 0.6, ins: 1600, hfa: "WCDA", hfaUrl: "https://www.wcda.wyoming.gov" }
  ];

  function byCode(code) {
    for (var i = 0; i < STATES.length; i++) if (STATES[i].code === code) return STATES[i];
    return null;
  }

  /* Mount a state selector into an existing <select> or create one inside a container,
     wiring state defaults into the given input ids. */
  function mount(selectEl, mapping, onApply) {
    if (!selectEl || !mapping || !mapping.tax || !mapping.ins) return;
    selectEl.setAttribute("aria-label", "Set state defaults for tax and insurance");
    var opt = document.createElement("option");
    opt.value = ""; opt.textContent = "State defaults…";
    selectEl.appendChild(opt);
    STATES.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.code; o.textContent = s.name;
      selectEl.appendChild(o);
    });
    var saved = null;
    try { saved = localStorage.getItem("twt_state"); } catch (e) {}
    if (saved && byCode(saved)) selectEl.value = saved;
    selectEl.addEventListener("change", function () {
      var s = byCode(selectEl.value);
      if (!s) return;
      try { localStorage.setItem("twt_state", selectEl.value); } catch (e) {}
      var tax = document.getElementById(mapping.tax);
      var ins = document.getElementById(mapping.ins);
      if (tax) tax.value = s.tax;
      if (ins) ins.value = s.ins;
      if (typeof onApply === "function") onApply(s);
      var note = document.getElementById("twt-state-note");
      if (note) {
        note.textContent = "Defaults for " + s.name + ": " + s.tax + "% property tax, $" + s.ins.toLocaleString("en-US") + "/yr insurance (statewide planning averages — verify your county). First-time-buyer programs: " + s.hfa + ".";
        note.style.display = "block";
      }
    });
  }

  window.TWT_STATE = { data: STATES, byCode: byCode, mount: mount };
})();
