interface Props {
  faq?: {
    items?: {
      question: string;
      answer: string;
    }[];
  };
}



export const FAQSettingsCard = ({ faq }: Props) => {

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Training FAQ</h2>

        <p className="text-sm text-gray-500">
          Questions displayed on the training website.
        </p>
      </div>

      <div className="space-y-4">
        {faq?.items?.map((item, index) => (
          <div key={index} className="border rounded-xl p-4">
            <p className="font-medium">{item.question}</p>

            <p className="text-sm text-gray-500 mt-2">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
