
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Star, Gift, TrendingUp, Award } from "lucide-react";

const LoyaltyPoints = () => {
  const { user } = useAuth();
  const { customers } = useData();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    if (user?.phoneNumber) {
      const customer = customers.find(c => c.phoneNumber === user.phoneNumber);
      setLoyaltyPoints(customer?.loyaltyPoints || 0);
    }
  }, [user, customers]);

  const availableRewards = [
    { id: 1, name: '5% Off Next Purchase', points: 50, description: 'Save 5% on your next order' },
    { id: 2, name: 'Free Delivery', points: 100, description: 'Get free delivery on any order' },
    { id: 3, name: '10% Off Next Purchase', points: 150, description: 'Save 10% on your next order' },
    { id: 4, name: 'Free Product Voucher', points: 200, description: 'Get any product under $10 for free' },
    { id: 5, name: '15% Off Next Purchase', points: 300, description: 'Save 15% on your next order' },
  ];

  const pointsHistory = [
    { date: '2024-01-15', points: 25, type: 'earned', description: 'Order #1234 - $250 purchase' },
    { date: '2024-01-10', points: 15, type: 'earned', description: 'Order #1233 - $150 purchase' },
    { date: '2024-01-05', points: 50, type: 'redeemed', description: '5% Off Next Purchase reward' },
    { date: '2024-01-01', points: 20, type: 'earned', description: 'Order #1232 - $200 purchase' },
  ];

  const canRedeem = (requiredPoints: number) => loyaltyPoints >= requiredPoints;

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="store-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-store-blue to-store-blue-light rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-store-blue">
              {loyaltyPoints}
            </CardTitle>
            <CardDescription>Current Points Balance</CardDescription>
          </CardHeader>
        </Card>

        <Card className="store-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              ${(loyaltyPoints * 0.5).toFixed(2)}
            </CardTitle>
            <CardDescription>Points Value (1 point = $0.50)</CardDescription>
          </CardHeader>
        </Card>

        <Card className="store-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600">
              {availableRewards.filter(r => canRedeem(r.points)).length}
            </CardTitle>
            <CardDescription>Available Rewards</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Redeem your points for these exclusive rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableRewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                <Badge variant="outline" className="mt-2">
                  {reward.points} points required
                </Badge>
              </div>
              <Button
                className={canRedeem(reward.points) ? "store-button" : ""}
                variant={canRedeem(reward.points) ? "default" : "outline"}
                disabled={!canRedeem(reward.points)}
              >
                {canRedeem(reward.points) ? 'Redeem' : 'Not Enough Points'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>
            Track your recent points activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pointsHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{entry.description}</p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
                <Badge
                  variant={entry.type === 'earned' ? 'default' : 'secondary'}
                  className={entry.type === 'earned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {entry.type === 'earned' ? '+' : '-'}{entry.points} points
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
          <CardDescription>
            Learn about our loyalty program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-store-blue mb-2">Shop & Earn</h3>
              <p className="text-sm text-gray-600">Earn 1 point for every $10 spent</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">Bonus Events</h3>
              <p className="text-sm text-gray-600">Double points during special promotions</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-600 mb-2">Referrals</h3>
              <p className="text-sm text-gray-600">Earn 50 points for each friend you refer</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-600 mb-2">Reviews</h3>
              <p className="text-sm text-gray-600">Get 5 points for each product review</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyPoints;
