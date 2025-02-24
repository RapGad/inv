const  Investment  = require("../model/investment-model");
const cron = require("node-cron");
const mongoose = require("mongoose");
const updateInvestmentStatus = ()=>{

    cron.schedule("0 0 * * *", async () => {
        try {
            // Get current date
            const today = new Date();
        
            // Find investments that are pending and should now be completed
            const investments = await Investment.find({
              status: "pending",
              endDate: { $lte: today }, // Select investments where endDate is today or earlier
            });
        
            if (investments.length === 0) {
              console.log("✅ No investments due for update.");
              return;
            }

            /**
             * 
             * Produvtion level code
             * 
             * const result = await Investment.updateMany(
    { status: "pending", endDate: { $lte: today } },
    { $set: { status: "completed" } }
);
console.log(`✅ ${result.modifiedCount} investments updated.`);

             */
        
            // Update each investment status to "completed"
            for (let investment of investments) {
              investment.status = "completed";
              await investment.save();
              console.log(`✅ Investment ${investment._id} marked as completed.`);
            }
        
            console.log("🎉 All due investments updated successfully.");
        
          } catch (error) {
            console.error("❌ Error updating investments:", error);
          }
        
    })
    // Update investment status here
}

module.exports = {updateInvestmentStatus}