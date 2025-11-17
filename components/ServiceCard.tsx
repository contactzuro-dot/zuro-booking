import Link from 'next/link';
import { Service } from '@/lib/types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const price = (service.price / 100).toFixed(2);
  const deposit = ((service.price * service.deposit_percent) / 10000).toFixed(2);

  return (
    <Link
      href={`/book?service=${service.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Duration: {service.duration} min</span>
          <span className="text-sm text-gray-500">Deposit: ${deposit}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#059669]">${price}</p>
        </div>
      </div>
    </Link>
  );
}

