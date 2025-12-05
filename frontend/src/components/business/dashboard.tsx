import { Card } from "../ui/card";
import {
  Clock,
  CheckCircle2,
  Wrench,
  XCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
  DollarSign,
  Star,
} from "lucide-react";

interface DashboardStats {
  todayRequests: number;
  pendingApproval: number;
  inProgress: number;
  completedToday: number;
  rejectedToday: number;
  totalRevenue?: string;
  totalEarnings?: number;
  completedRequests?: number;
  activeRequests?: number;
  averageRating?: number;
  monthlyRevenue?: number;
  weeklyRevenue?: number;
}

interface DashboardProps {
  stats: DashboardStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      title: "Bugünkü Talepler",
      value: stats.todayRequests,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Onay Bekleyen",
      value: stats.pendingApproval,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      highlight: stats.pendingApproval > 0,
    },
    {
      title: "İşlemde",
      value: stats.inProgress,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Bugün Tamamlanan",
      value: stats.completedToday,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">İşletmenizin genel durumunu buradan takip edebilirsiniz</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`p-6 ${stat.highlight ? "ring-2 ring-yellow-400 ring-offset-2" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Earnings Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
              <p className="text-2xl font-bold">₺{stats.totalEarnings?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bu Ay:</span>
              <span className="font-medium">₺{stats.monthlyRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bu Hafta:</span>
              <span className="font-medium">₺{stats.weeklyRevenue?.toLocaleString() || 0}</span>
            </div>
          </div>
        </Card>

        {/* Completed Requests Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamamlanan İşler</p>
              <p className="text-2xl font-bold">{stats.completedRequests || 0}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aktif:</span>
              <span className="font-medium">{stats.activeRequests || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bugün:</span>
              <span className="font-medium">{stats.completedToday}</span>
            </div>
          </div>
        </Card>

        {/* Average Rating Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ortalama Puan</p>
              <p className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || "0.0"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= (stats.averageRating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Revenue Card */}
      {stats.totalRevenue && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bugünkü Gelir</p>
              <p className="text-2xl font-bold">{stats.totalRevenue}</p>
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Önceki güne göre artış</span>
          </div>
        </Card>
      )}

      {/* Activity Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Özet Durum</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Tamamlanan İşler</span>
              </div>
              <span className="font-medium">{stats.completedToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm">Devam Eden İşler</span>
              </div>
              <span className="font-medium">{stats.inProgress}</span>
            </div>
            {stats.rejectedToday > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm">Reddedilen</span>
                </div>
                <span className="font-medium">{stats.rejectedToday}</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Hızlı İstatistikler</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ortalama İş Süresi</span>
              <span className="font-medium">2.5 gün</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Müşteri Memnuniyeti</span>
              <span className="font-medium">{((stats.averageRating || 0) * 20).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tekrar Eden Müşteri</span>
              <span className="font-medium">45%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      {stats.pendingApproval > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Onay Bekleyen Talepler</h3>
              <p className="text-sm text-yellow-700">
                {stats.pendingApproval} adet talep onayınızı bekliyor. Talep Yönetimi sekmesinden inceleyebilirsiniz.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
