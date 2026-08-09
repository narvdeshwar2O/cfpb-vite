import { useStateDistrictMaster } from "@/shared/hooks/use-master";
import type { MultiSelectOption } from "@/components/ui/multi-select";

export function useFilterOptions(
  effectiveStates: string[],
  selectedDistricts: string[]
) {
  const { data: masterData } = useStateDistrictMaster();

  const stateOptions: MultiSelectOption[] = [{ label: "All", value: "all" }];
  const districtOptions: MultiSelectOption[] = [{ label: "All", value: "all" }];
  const psOptions: MultiSelectOption[] = [{ label: "All", value: "all" }];

  if (masterData?.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap: Record<string, any[]> = masterData.data;
    
    Object.keys(dataMap)
      .sort()
      .forEach((state) => {
        stateOptions.push({ label: state, value: state });
      });

    const isAllStatesSelected = effectiveStates.length === 0 || effectiveStates.includes("all");
    const isAllDistrictsSelected = selectedDistricts.length === 0 || selectedDistricts.includes("all");
    
    const districtsToShow = new Set<string>();
    const psToShow = new Set<string>();

    const statesToProcess = isAllStatesSelected ? Object.keys(dataMap) : effectiveStates;

    statesToProcess.forEach((stateKey) => {
      if (!stateKey) return;
      const actualKey = Object.keys(dataMap).find(k => k.toUpperCase() === stateKey.toUpperCase());
      if (actualKey && dataMap[actualKey]) {
        dataMap[actualKey].forEach(distObj => {
          if (!distObj || !distObj.district) return;
          districtsToShow.add(distObj.district);
          
          if (isAllDistrictsSelected || selectedDistricts.map(d => d?.toUpperCase()).includes(distObj.district.toUpperCase())) {
            distObj.police_stations?.forEach((ps: { ps: string; ps_cd: number }) => {
              if (ps?.ps) {
                psToShow.add(ps.ps);
              }
            });
          }
        });
      }
    });

    Array.from(districtsToShow).sort().forEach((d) => districtOptions.push({ label: d, value: d }));
    Array.from(psToShow).sort().forEach((p) => psOptions.push({ label: p, value: p }));
  }

  return { stateOptions, districtOptions, psOptions };
}
