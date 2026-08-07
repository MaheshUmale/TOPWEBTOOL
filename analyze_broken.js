const fs = require('fs');
const tools = [
  'agent-eval-engine', 'agent-hitl-planner', 'agent-memory-matrix', 'agent-prompt-builder',
  'ai-system-topology', 'battery-busbar-calculator', 'car-lease-estimator', 'connector-pinout-mapper',
  'enclosure-thermal-solver', 'harness-diameter-modeler', 'inflation-calculator', 'mortgage-calculator',
  'openapi-tool-converter', 'pcb-impedance-calculator', 'prompt-chain-debugger', 'prompt-injection-guardrail',
  'rag-chunking-simulator'
];

for (const t of tools) {
  const html = fs.readFileSync('PUBLIC/' + t + '/index.html', 'utf8');
  const hasSidebar = html.includes('lg:col-span-1');
  const mainOpen = html.indexOf('<div class="lg:col-span-3');
  const sidebarIdx = html.indexOf('lg:col-span-1', mainOpen);
  const between = html.substring(mainOpen, sidebarIdx > 0 ? sidebarIdx : html.length);
  const articlesOutside = between.includes('<!-- Informative Articles');
  const seoOutside = between.includes('<!-- Semantic SEO Instructional Hub -->');
  const siloOutside = between.includes('<!-- Semantic SEO Related Tool Matrix Silo -->');
  const mainClose = between.lastIndexOf('</div>');
  console.log(`${t}: sidebar=${hasSidebar} articlesOut=${articlesOutside} seoOut=${seoOutside} siloOut=${siloOutside} mainClosePosInBetween=${mainClose}`);
}
