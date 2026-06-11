import AnalysisWizard from "@/components/analysis/AnalysisWizard";

export const metadata = { title: "New Analysis" };

export default function AnalyzePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">New Analysis</h1>
        <p className="text-white/50 mt-1">
          Submit a URL or describe an app to generate a superior version.
        </p>
      </div>
      <AnalysisWizard />
    </div>
  );
}
