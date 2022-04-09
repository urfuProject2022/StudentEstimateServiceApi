using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Infrastructure.Services.InviteService
{
    public class InviteService : IInviteService
    {
        private readonly IRoomRepository roomRepository;
        private readonly IUserRepository userRepository;

        public InviteService(IRoomRepository roomRepository, IUserRepository userRepository)
        {
            this.roomRepository = roomRepository;
            this.userRepository = userRepository;
        }

        public async Task<OperationResult> Accept(string roomId, ObjectId userId)
        {
            var findRoomResult = await roomRepository.FindById(roomId);

            if (findRoomResult.IsError)
                return findRoomResult;

            var findUserResult = await userRepository.FindById(userId);

            if (findUserResult.IsError)
                return findUserResult;

            var room = findRoomResult.Result;
            var user = findUserResult.Result;

            if (IsConflict(room, user))
                return OperationResult.Fail("Conflict", 409);

            if (IsUserInRoom(room, userId))
                return OperationResult.Success();

            user.Rooms.Add(room.Id);
            await userRepository.Update(user);

            room.Users.Add(userId);
            await roomRepository.Update(room);

            return OperationResult.Success();
        }

        public OperationResult<string> GenerateInviteUrl(string domain, ObjectId roomId)
        {
            if (domain == null)
                return OperationResult<string>.Fail("Wrong domain", 500);

            return OperationResult<string>.Success($"https://{domain}/api/invites/accept?roomId={roomId}");
        }

        private static bool IsConflict(Room room, User user)
        {
            if (room.Users.Contains(user.Id) && !user.Rooms.Contains(room.Id))
                return true;

            if (room.OwnerId == user.Id && !user.CreatedRooms.Contains(room.Id))
                return true;

            return false;
        }

        private static bool IsUserInRoom(Room room, ObjectId user)
        {
            return room.Users.Contains(user) || room.OwnerId == user;
        }
    }
}