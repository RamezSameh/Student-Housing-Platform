using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Student_Housing_Platform.Migrations
{
    /// <inheritdoc />
    public partial class ConvertRoomTypeToHousingTypeFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Make sure the room-layout housing types exist (idempotent).
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM HousingTypes WHERE HousingTypeName = 'Single')
    INSERT INTO HousingTypes (HousingTypeName, Description, Capacity, PricePerMonth)
    VALUES ('Single', 'Single-occupancy room', 1, 1500);
IF NOT EXISTS (SELECT 1 FROM HousingTypes WHERE HousingTypeName = 'Double')
    INSERT INTO HousingTypes (HousingTypeName, Description, Capacity, PricePerMonth)
    VALUES ('Double', 'Double-occupancy room', 2, 1100);
IF NOT EXISTS (SELECT 1 FROM HousingTypes WHERE HousingTypeName = 'Triple')
    INSERT INTO HousingTypes (HousingTypeName, Description, Capacity, PricePerMonth)
    VALUES ('Triple', 'Triple-occupancy room', 3, 900);
");

            // 2. Add the new FK column as nullable so existing rows can be mapped first.
            migrationBuilder.AddColumn<int>(
                name: "HousingTypeId",
                table: "HousingRooms",
                type: "int",
                nullable: true);

            // 3. Map the old free-text RoomType values onto the matching HousingType rows.
            migrationBuilder.Sql(@"
UPDATE HousingRooms
SET HousingTypeId = (SELECT HousingTypeId FROM HousingTypes WHERE HousingTypeName = 'Single')
WHERE RoomType = 'Single';
UPDATE HousingRooms
SET HousingTypeId = (SELECT HousingTypeId FROM HousingTypes WHERE HousingTypeName = 'Double')
WHERE RoomType = 'Double';
UPDATE HousingRooms
SET HousingTypeId = (SELECT HousingTypeId FROM HousingTypes WHERE HousingTypeName = 'Triple')
WHERE RoomType = 'Triple';
UPDATE HousingRooms
SET HousingTypeId = (SELECT HousingTypeId FROM HousingTypes WHERE HousingTypeName = 'Studio')
WHERE RoomType = 'Studio';
");

            // 4. Defensive fallback for any unexpected leftover values.
            migrationBuilder.Sql(@"
UPDATE HousingRooms
SET HousingTypeId = (SELECT TOP 1 HousingTypeId FROM HousingTypes WHERE HousingTypeName = 'Room')
WHERE HousingTypeId IS NULL;
");

            // 5. Now that every row is mapped, make the column required.
            migrationBuilder.AlterColumn<int>(
                name: "HousingTypeId",
                table: "HousingRooms",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            // 6. Drop the old free-text column.
            migrationBuilder.DropColumn(
                name: "RoomType",
                table: "HousingRooms");

            migrationBuilder.CreateIndex(
                name: "IX_HousingRooms_HousingTypeId",
                table: "HousingRooms",
                column: "HousingTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_HousingRooms_HousingTypes_HousingTypeId",
                table: "HousingRooms",
                column: "HousingTypeId",
                principalTable: "HousingTypes",
                principalColumn: "HousingTypeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HousingRooms_HousingTypes_HousingTypeId",
                table: "HousingRooms");

            migrationBuilder.DropIndex(
                name: "IX_HousingRooms_HousingTypeId",
                table: "HousingRooms");

            migrationBuilder.AddColumn<string>(
                name: "RoomType",
                table: "HousingRooms",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            // Restore the free-text values from the FK before dropping it.
            migrationBuilder.Sql(@"
UPDATE hr
SET hr.RoomType = ht.HousingTypeName
FROM HousingRooms hr
INNER JOIN HousingTypes ht ON ht.HousingTypeId = hr.HousingTypeId;
");

            migrationBuilder.DropColumn(
                name: "HousingTypeId",
                table: "HousingRooms");
        }
    }
}
