const names = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return code;
  return names.of(normalized) ?? normalized;
}

export function CountryLabel({ code }: { code: string }) {
  const normalized = code.trim().toLowerCase();
  return <span className="inline-flex items-center gap-2 align-middle max-w-full"><span aria-hidden="true" className={`fi fi-${normalized} shrink-0`}/><span className="break-words">{countryName(code)}</span></span>;
}

export function CountryList({ codes, empty }: { codes?: string[] | undefined; empty: string }) {
  if (!codes?.length) return <span>{empty}</span>;
  return <span className="inline-flex flex-wrap gap-x-4 gap-y-2 align-middle">{codes.map(code => <CountryLabel key={code} code={code}/>)}</span>;
}